package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.core.net.toUri
import androidx.lifecycle.lifecycleScope
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityTirarFotoClienteBinding
import com.google.common.util.concurrent.ListenableFuture
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.async
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import java.io.File
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class TakePhotoActivity : AppCompatActivity() {

    // Declaração da variável para o binding da ActivityTirarFotoCliente
    private lateinit var binding: ActivityTirarFotoClienteBinding
    // Processamento de imagem, controlar melhor o estado do driver da câmera
    private lateinit var cameraProviderFuture: ListenableFuture<ProcessCameraProvider>
    // Selecionar a câmera frontal ou traseira
    private lateinit var cameraSelector: CameraSelector
    // Imagem capturada
    private var imageCapture: ImageCapture? = null
    // Executor de thread separado, objeto do Android no qual pode criar uma thread para gravar a imagem
    private lateinit var imgCameraExecutor: ExecutorService
    // Variável para armazenar o caminho da imagem no Firebase Storage
    private lateinit var imagemBucketStorageOne: String
    // Instâncias do Firestore e FirebaseAuth
    private lateinit var database: FirebaseFirestore
    private lateinit var auth: FirebaseAuth
    // Variável para armazenar os dados do documento de locação
    private var hireDocumentdata: String? = null

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        // Inicializa o binding com o layout da ActivityTirarFotoCliente
        binding = ActivityTirarFotoClienteBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Inicializa a câmera
        cameraProviderFuture = ProcessCameraProvider.getInstance(this)
        cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
        imgCameraExecutor = Executors.newSingleThreadExecutor()

        // Obtém os dados do documento de locação passados pela intent
        hireDocumentdata = intent.getStringExtra("hiredId")
        Log.d("Dados Recebidos", "hireDocumentId: $hireDocumentdata")

        if (hireDocumentdata == null) {
            Toast.makeText(this, "Erro ao receber dados", Toast.LENGTH_SHORT).show()
            binding.btnTakePhoto.isEnabled = false
        }

        // Inicializa o Firestore e FirebaseAuth
        database = FirebaseFirestore.getInstance()
        auth = FirebaseAuth.getInstance()

        // Chama o método startCamera para iniciar a câmera
        startCamera()

        // Configura o clique no botão para tirar foto
        binding.btnTakePhoto.setOnClickListener {
            lifecycleScope.launch {
                val photoJob = async { takePhoto() }
                val result = photoJob.await()
                if (result != null) {
                    imagemBucketStorageOne = result
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        blinkPreview()
                    }
                    binding.btnProximo.visibility = View.VISIBLE
                } else {
                    Log.e("CameraPreview", "Erro ao tirar foto")
                }
            }
        }

        // Configura o clique no botão de voltar
        binding.backLocators.setOnClickListener {
            backLocatorsAct()
        }

        // Configura o clique no botão "Próximo" para navegar para a próxima atividade de tirar foto
        binding.btnProximo.setOnClickListener {
            viewTakePhotoTwo(hireDocumentdata.toString(), imagemBucketStorageOne)
        }
    }

    // Método para iniciar a câmera
    private fun startCamera() {
        cameraProviderFuture.addListener({
            imageCapture = ImageCapture.Builder().build()
            val cameraProvider = cameraProviderFuture.get()
            val preview = Preview.Builder().build().also {
                it.setSurfaceProvider(binding.cameraPreviewView.surfaceProvider)
            }
            try {
                // Abrir o Preview e realizar uma captura de imagem
                cameraProvider.unbindAll()
                cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageCapture)
            } catch (e: Exception) {
                Log.e("CameraPreview", "Falha ao abrir a câmera.")
            }
        }, ContextCompat.getMainExecutor(this))
    }

    // Função suspensa para tirar foto
    private suspend fun takePhoto(): String? {
        val imagePath = CompletableDeferred<String?>()

        imageCapture?.let {
            val fileName = "Client_JPEG_${System.currentTimeMillis()}"
            val file = File(externalMediaDirs.first(), "${fileName}.jpg")
            val outputOptions = ImageCapture.OutputFileOptions.Builder(file).build()

            it.takePicture(
                outputOptions,
                imgCameraExecutor,
                object : ImageCapture.OnImageSavedCallback {
                    override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                        lifecycleScope.launch {
                            imagePath.complete(uploadImageToFirebaseForOne(file))
                        }
                    }

                    override fun onError(exception: ImageCaptureException) {
                        Log.e("CameraPreview", "Exceção ao gravar arquivo da foto: $exception")
                        imagePath.completeExceptionally(exception)
                    }
                })
        }

        return imagePath.await()
    }

    // Função suspensa para fazer upload da imagem para o Firebase
    private suspend fun uploadImageToFirebaseForOne(file: File): String? {
        val storageRef = FirebaseStorage.getInstance().reference
        val imageRef = storageRef.child("images/${file.name}")
        val fileUri = file.toUri()

        return try {
            imageRef.putFile(fileUri).await()
            "images/${file.name}"
        } catch (e: Exception) {
            Log.e("CameraPreviewActivity", "Erro ao fazer upload da imagem", e)
            null
        }
    }

    @RequiresApi(Build.VERSION_CODES.M)
    private fun blinkPreview() {
        // Efeito de flash na tela. A tela fica branca por 100ms, espera 50ms e volta ao normal.
        binding.root.postDelayed({
            binding.root.foreground = ColorDrawable(Color.WHITE)
            binding.root.postDelayed({
                binding.root.foreground = null
            }, 50)
        }, 100)
    }

    // Função para retornar à atividade de definir a quantidade de locadores
    private fun backLocatorsAct() {
        val intent = Intent(this, SetQuantityLocatorsActivity::class.java)
        startActivity(intent)
        finish()
    }

    // Função para navegar para a próxima atividade de tirar foto
    private fun viewTakePhotoTwo(dadosList: String, imagemLoc: String) {
        val intentPhotoTwo = Intent(this, TakePhoto2Activity::class.java)
        intentPhotoTwo.putExtra("hiredId", dadosList)
        intentPhotoTwo.putExtra("imageLoc1", imagemLoc)
        startActivity(intentPhotoTwo)
        finish()
    }
}
