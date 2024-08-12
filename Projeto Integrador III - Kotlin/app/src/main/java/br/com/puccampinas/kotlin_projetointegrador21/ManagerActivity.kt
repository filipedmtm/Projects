package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityGerenciararmariosBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase

class ManagerActivity : AppCompatActivity() {

    // Declaração da variável para o binding da ActivityGerenciararmarios
    private lateinit var binding: ActivityGerenciararmariosBinding
    // Instancia o FirebaseAuth para autenticação de usuários
    private var auth: FirebaseAuth = Firebase.auth

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Ativa o modo de borda a borda (Edge to Edge)
        enableEdgeToEdge()
        // Inicializa o binding com o layout da ActivityGerenciararmarios
        binding = ActivityGerenciararmariosBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Obtém o managerInstance passado pela intent
        val managerInstance = intent.getSerializableExtra("managerInstance")
        val managerSalvo = managerInstance

        // Inicializa o FirebaseAuth
        auth = FirebaseAuth.getInstance()

        // Função para abrir a atividade de informações do gerente
        fun managerInfoAct(){
            val intentManagerInfo = Intent(this, ManagerInfoActivity::class.java)
            intentManagerInfo.putExtra("managerInstance", managerSalvo)
            startActivity(intentManagerInfo)
            finish() // Finaliza a atividade atual
        }

        // Configura o clique no botão para liberar locação e acessar a câmera
        binding.btnLiberarLoc.setOnClickListener {
            cameraProviderResult.launch(android.Manifest.permission.CAMERA)
        }

        // Configura o clique no botão de informações do gerente
        binding.btnInfoGerente.setOnClickListener {
            managerInfoAct()
        }

        // Configura o clique no botão de sair
        binding.btnExit.setOnClickListener {
            btnExitAct()
        }

        // Configura o clique no botão de acessar locação
        binding.btnAcessarLocacao.setOnClickListener {
            acessarLocacao()
        }
    }

    // Atributo para fornecer uma permissão
    private val cameraProviderResult = registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) {
            viewReaderQrCodeAct()
        } else {
            Toast.makeText(this, "Você não concedeu acesso para usar a câmera", Toast.LENGTH_SHORT).show()
        }
    }

    // Método para abrir a atividade de leitura de QR Code
    private fun viewReaderQrCodeAct() {
        val intentReaderQrCode = Intent(this, QrCodeReadActivity::class.java)
        startActivity(intentReaderQrCode)
    }

    // Método para realizar a ação de sair da conta
    private fun btnExitAct() {
        auth.signOut()
        val intentExit = Intent(applicationContext, LoginActivity::class.java)
        startActivity(intentExit)
        finish()
    }

    // Método para acessar a locação através de NFC
    private fun acessarLocacao() {
        val intentNfcRead = Intent(this, NFCReadActivity::class.java)
        startActivity(intentNfcRead)
    }
}
