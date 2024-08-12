package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityManagerinfoBinding

class ManagerInfoActivity : AppCompatActivity() {
    // Classe de dados para representar um gerente
    data class Manager(
        val nome: String = "",
        val email: String = "",
        val cpf: String = "",
        val localidade: String = "",
        val gerenteAtivo: Boolean = false
    )

    // Declaração da variável para o binding da ActivityManagerinfo
    private lateinit var binding: ActivityManagerinfoBinding

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Ativa o modo de borda a borda (Edge to Edge)
        enableEdgeToEdge()
        // Inicializa o binding com o layout da ActivityManagerinfo
        binding = ActivityManagerinfoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Obtém a instância do gerente passada pela intent
        val managerInstance = intent.getSerializableExtra("managerInstance") as Manager?

        // Verifica se a instância do gerente não é nula
        if (managerInstance != null) {
            // Obtém os dados do gerente e define nos TextViews correspondentes
            val name = managerInstance.nome
            val cpf = managerInstance.cpf
            val loc = managerInstance.localidade

            binding.nameManager.text = name
            binding.cpfManager.text = cpf
            binding.locManager.text = loc
        } else {
            // Exibe uma mensagem de erro se não conseguir carregar as informações do gerente
            Toast.makeText(this, "Erro ao carregar informações do gerente", Toast.LENGTH_SHORT).show()
        }

        // Configura o clique no botão de voltar
        binding.btnBackManager.setOnClickListener {
            viewManagerAct()
        }
    }

    // Método para abrir a atividade do gerente
    private fun viewManagerAct() {
        val intentManager = Intent(this, ManagerActivity::class.java)
        startActivity(intentManager)
        finish()
    }
}
