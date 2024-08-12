package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivitySetLocatorsBinding

class SetQuantityLocatorsActivity : AppCompatActivity() {
    // Declaração da variável para o binding da ActivitySetLocators
    private lateinit var binding: ActivitySetLocatorsBinding
    // Declaração da variável para armazenar o ID do documento de locação
    private lateinit var hireDocumentId: String

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        // Inicializa o binding com o layout da ActivitySetLocators
        binding = ActivitySetLocatorsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Obtém o ID do documento de locação passado pela intent
        hireDocumentId = intent.getStringExtra("hiredId").toString()
        Log.d("MyTag", "hireDocumentIdArray: $hireDocumentId")

        // Função para navegar para a atividade de tirar foto de um locador
        fun viewOneLocatorAct(documentId: String) {
            val documentIdLoc = documentId
            val intent = Intent(this, TakeOneLocatorPhotoActivity::class.java)
            intent.putExtra("hiredId", documentIdLoc)
            Log.d("MyTag", "hireDocument: $documentIdLoc")
            startActivity(intent)
            finish()
        }

        // Função para navegar para a atividade de tirar fotos de dois locadores
        fun viewTwoLocatorAct(documentId: String) {
            val documentIdLoc = documentId
            val intent = Intent(this, TakePhotoActivity::class.java)
            intent.putExtra("hiredId", documentIdLoc)
            startActivity(intent)
            finish()
        }

        // Configura o clique no botão para uma pessoa
        binding.btnUmaPessoa.setOnClickListener {
            viewOneLocatorAct(hireDocumentId)
        }

        // Configura o clique no botão para duas pessoas
        binding.btnDuasPessoas.setOnClickListener {
            viewTwoLocatorAct(hireDocumentId)
        }

        // Configura o clique no botão de voltar
        binding.btnBack.setOnClickListener {
            backQrCodeAct()
        }

        // Exibe o ID do documento de locação no TextView de mensagem de erro
        binding.tvErrorMessage.text = hireDocumentId
    }

    // Método para voltar à atividade de leitura de QR Code
    private fun backQrCodeAct() {
        val intent = Intent(this, QrCodeReadActivity::class.java)
        startActivity(intent)
        finish()
    }
}
