package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityBalanceBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class BalanceActivity : AppCompatActivity() {
    // Declaração da variável para o binding da ActivityBalance
    private lateinit var binding: ActivityBalanceBinding
    // Instancia o Firestore para interagir com o banco de dados
    private val db = FirebaseFirestore.getInstance()

    companion object {
        // Constante para facilitar a identificação de logs desta atividade
        private const val TAG = "BalanceActivity"
    }

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Inicializa o binding com o layout da ActivityBalance
        binding = ActivityBalanceBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Configura o clique no botão de adicionar cartão
        binding.btnAddCard.setOnClickListener {
            // Cria uma intent para abrir a atividade de adicionar cartão de crédito
            val intentAddCard = Intent(applicationContext, creditCard_activity::class.java)
            startActivity(intentAddCard)
        }

        // Configura o clique no botão de voltar para o menu
        binding.btnBackMenu.setOnClickListener {
            // Cria uma intent para abrir a atividade do menu
            val intentBackMenu = Intent(applicationContext, MenuActivity::class.java)
            startActivity(intentBackMenu)
        }

        // Obtém o usuário atual autenticado no Firebase
        val user = FirebaseAuth.getInstance().currentUser
        if (user != null) {
            // Referência ao documento do usuário no Firestore
            val docRef = db.collection("Client_Users").document(user.uid)
            docRef.get().addOnSuccessListener { document ->
                if (document.exists()) {
                    // Atualiza o saldo se o documento do usuário existir
                    updateBalance(user.uid)
                } else {
                    Log.d(TAG, "Documento não existe")
                }
            }.addOnFailureListener { exception ->
                Log.d(TAG, "Falha ao obter o documento: ", exception)
            }
        } else {
            Log.d(TAG, "Usuário não está logado")
        }
    }

    // Método para atualizar o saldo do usuário
    private fun updateBalance(userId: String) {
        // Referência ao documento do saldo do usuário no Firestore
        val docRef = db.collection("Client_Users").document(userId).collection("saldo").document("valor_carteira")
        docRef.get().addOnSuccessListener { document ->
            if (document.exists()) {
                // Obtém o valor do saldo do documento
                val balance = document.getDouble("saldo")
                if (balance != null) {
                    // Atualiza o texto do saldo atual na interface
                    binding.saldoAtual.text = "R$ ${String.format("%.2f", balance)}"
                } else {
                    Log.d(TAG, "Campo 'saldo' não existe")
                }
            } else {
                Log.d(TAG, "Documento não existe")
            }
        }.addOnFailureListener { exception ->
            Log.d(TAG, "Falha ao obter o documento: ", exception)
        }
    }
}
