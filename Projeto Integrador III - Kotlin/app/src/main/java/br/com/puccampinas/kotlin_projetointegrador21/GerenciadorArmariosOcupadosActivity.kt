package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityGerenciadorArmariosOcupadosBinding

class GerenciadorArmariosOcupadosActivity : AppCompatActivity() {
    // Declaração da variável para o binding da ActivityGerenciadorArmariosOcupados
    private lateinit var binding: ActivityGerenciadorArmariosOcupadosBinding

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Inicializa o binding com o layout da ActivityGerenciadorArmariosOcupados
        binding = ActivityGerenciadorArmariosOcupadosBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Configura o clique no botão de abrir armário
        binding.btnAbrirArmario.setOnClickListener {
            Toast.makeText(this, "Armário aberto! Lembre-se de fechado após o uso...", Toast.LENGTH_SHORT).show()
        }

        // Configura o clique no botão de encerrar locação
        binding.btnEncerrarLocacao.setOnClickListener {
            val intent = Intent(this, NFCCleanActivity::class.java)
            startActivity(intent)
        }
    }
}
