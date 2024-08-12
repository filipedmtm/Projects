package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.CameraSelector
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityQrcodeScanBinding
import com.google.common.util.concurrent.ListenableFuture
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class QrCodeReadActivity : AppCompatActivity() {
    // Declaração da variável para o binding da ActivityQrcodeScan
    private lateinit var binding: ActivityQrcodeScanBinding
    // Processamento de imagem, controlar melhor o estado do driver da câmera
    private lateinit var cameraProviderFuture: ListenableFuture<ProcessCameraProvider>
    // Selecionar a câmera frontal ou traseira
    private lateinit var cameraSelector: CameraSelector
    // Imagem capturada
    private var imageCapture: ImageCapture? = null
    // Executor de thread separado, objeto do Android no qual pode criar uma thread para gravar a imagem
    private lateinit var imgCameraExecutor: ExecutorService

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        // Inicializa o binding com o layout da ActivityQrcodeScan
        binding = ActivityQrcodeScanBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Inicializa a câmera
        cameraProviderFuture = ProcessCameraProvider.getInstance(this)
        cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA
        imgCameraExecutor = Executors.newSingleThreadExecutor()

        // Chama o método startCamera
        startCamera()

        // Configura o clique no botão para definir a quantidade
        binding.btnSetquantity.setOnClickListener {
            val intent = Intent(this, SetQuantityLocatorsActivity::class.java)
            intent.putExtra("hiredId", binding.tvQrCode.text.toString())
            startActivity(intent)
            finish()
        }

        // Configura o clique no botão de voltar
        binding.backManager.setOnClickListener {
            viewManagerAct()
        }
    }

    // Método para iniciar a câmera
    private fun startCamera() {
        Log.d("ReadQrCode", "startCamera() chamado")
        cameraProviderFuture.addListener({
            val imageAnalysis = ImageAnalysis.Builder()
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build()

            val qrCodeAnalyzer = YourImageAnalyzer(this, binding)
            imageAnalysis.setAnalyzer(imgCameraExecutor, qrCodeAnalyzer)

            val cameraProvider = cameraProviderFuture.get()
            val preview = Preview.Builder().build().also {
                it.setSurfaceProvider(binding.cameraPreviewView.surfaceProvider)
            }
            try {
                // Abrir o Preview e realizar uma captura de imagem
                cameraProvider.unbindAll()
                cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageAnalysis)
                Log.d("ReadQrCode", "Camera bound to lifecycle")
            } catch (e: Exception) {
                Log.e("CameraPreview", "Falha ao abrir a câmera.")
            }
        }, ContextCompat.getMainExecutor(this))
    }

    // Método para retornar à atividade do gerente
    private fun viewManagerAct() {
        Log.d("ReadQrCode", "viewManagerAct() chamado")
        val intentManager = Intent(this, ManagerActivity::class.java)
        startActivity(intentManager)
        Log.d("ReadQrCode", "ManagerActivity iniciado")
        finish()
    }

    // Classe para analisar as imagens capturadas
    private class YourImageAnalyzer(private val context: Context, private val bindingExt: ActivityQrcodeScanBinding) : ImageAnalysis.Analyzer {
        private var binding: ActivityQrcodeScanBinding = bindingExt
        // ID do contrato de aluguel
        private var hireId: String? = null
        private val options = BarcodeScannerOptions.Builder()
            .setBarcodeFormats(
                Barcode.FORMAT_QR_CODE,
                Barcode.FORMAT_AZTEC
            )
            .enableAllPotentialBarcodes()
            .build()
        private val scanner = BarcodeScanning.getClient(options)

        @ExperimentalGetImage
        override fun analyze(imageProxy: ImageProxy) {
            val mediaImage = imageProxy.image
            if (mediaImage != null) {
                val rotationDegrees = imageProxy.imageInfo.rotationDegrees
                val image = InputImage.fromMediaImage(mediaImage, rotationDegrees)
                processImage(image)
            }
        }

        // Método para processar a imagem e ler o QR Code
        fun processImage(image: InputImage) {
            Log.d("FunçãoAnalyzer", "A classe YourImageAnalyzer foi chamada")
            scanner.process(image)
                .addOnSuccessListener { barcodes ->
                    for (barcode in barcodes) {
                        val rawValue = barcode.rawValue
                        Log.d("ScanQrCode", "QR Code lido com sucesso. $rawValue")
                        Toast.makeText(context, "QR Code lido com sucesso. $rawValue", Toast.LENGTH_SHORT).show()
                        if (rawValue != null) {
                            hireId = rawValue
                            if (hireId != null) {
                                binding.tvQrCode.text = hireId
                                binding.btnSetquantity.visibility = android.view.View.VISIBLE
                            }
                        }
                    }
                }
                .addOnFailureListener {
                    Log.d("ScanQrCode", "Erro ao ler o QR Code.")
                    Toast.makeText(context, "Erro ao ler o QR Code...", Toast.LENGTH_SHORT).show()
                }
        }
    }
}
