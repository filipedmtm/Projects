package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityLibQuantityLocatorsBinding

class LibQuantityLocatorsActivity : AppCompatActivity() {
    // Declaração da variável para o binding da ActivityLibQuantityLocators
    private lateinit var binding: ActivityLibQuantityLocatorsBinding

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Ativa o modo de borda a borda (Edge to Edge)
        enableEdgeToEdge()
        // Inicializa o binding com o layout da ActivityLibQuantityLocators
        binding = ActivityLibQuantityLocatorsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Obtém os dados NFC passados pela intent
        val dados = intent.getStringExtra("dadosNFC")
        // Define a mensagem NFC no TextView
        binding.tvNFCMessage.text = dados

        // Configura o clique no botão para uma pessoa
        binding.btnUmaPessoa.setOnClickListener {
            val intent = Intent(this, ValidateOneLocatorActivity::class.java)
            intent.putExtra("dadosNFC", dados)
            startActivity(intent)
            finish() // Finaliza a atividade atual
        }

        // Configura o clique no botão para duas pessoas
        binding.btnDuasPessoas.setOnClickListener {
            val intent = Intent(this, validadeTwoLocatorActivity::class.java)
            intent.putExtra("dadosNFC", dados)
            startActivity(intent)
            finish() // Finaliza a atividade atual
        }

        // Configura o clique no botão de voltar
        binding.btnBack.setOnClickListener {
            backManagerAct()
        }
    }

    // Método para voltar à atividade de gerenciamento
    private fun backManagerAct() {
        val intent = Intent(this, ManagerActivity::class.java)
        startActivity(intent)
        finish() // Finaliza a atividade atual
    }
}
