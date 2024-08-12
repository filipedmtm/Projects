package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import android.text.InputType
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityCardformBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class creditCard_activity : AppCompatActivity() {
    // Declaração da variável para o binding da ActivityCardform
    private lateinit var binding: ActivityCardformBinding
    // Instancia o FirebaseAuth para autenticação de usuários
    private var auth: FirebaseAuth = FirebaseAuth.getInstance()
    // Instancia o Firestore para interagir com o banco de dados
    private var database: FirebaseFirestore = FirebaseFirestore.getInstance()
    // Declaração de variáveis para armazenar a data de expiração do cartão
    private lateinit var cardYearExpiration: String
    private lateinit var cardMonthExpiration: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Ativa o modo de borda a borda (Edge to Edge)
        enableEdgeToEdge()
        // Inicializa o binding com o layout da ActivityCardform
        binding = ActivityCardformBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Define o tipo de entrada do campo CVV para ser numérico e mascarado
        binding.CVV.inputType =
            InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_VARIATION_PASSWORD

        // Configura o clique no botão de adicionar cartão
        binding.btnCard.setOnClickListener {
            addPaymentCard()
        }

        // Configura o clique no botão de voltar
        binding.btnBack.setOnClickListener {
            viewBalanceAct()
        }
    }

    // Método para adicionar um cartão de pagamento
    private fun addPaymentCard() {
        val user = auth.uid
        if (user != null) {
            // Obtém os dados do cartão dos campos de entrada
            val nickname = binding.nickname.text.toString()
            val cardNumber = binding.NumeroCartao.text.toString()
            val cardName = binding.NomeCartao.text.toString()
            val expirationDate = binding.MesAno.text.toString()

            // Verifica se todos os campos estão preenchidos
            if (cardNumber.isNotEmpty() && cardName.isNotEmpty() && expirationDate.isNotEmpty()) {
                val splitDate = expirationDate.split("/")
                // Verifica se a data de expiração está no formato correto
                if (splitDate.size >= 2) {
                    var (cardExpirationMonth, cardExpirationYear) = splitDate[0] to splitDate[1]
                    cardYearExpiration = cardExpirationYear
                    cardMonthExpiration = cardExpirationMonth
                } else {
                    Toast.makeText(this, "Erro, necessário colocar '/' na expiração do cartão. Cartão não cadastrado...", Toast.LENGTH_SHORT).show()
                    return
                }

                // Cria um mapa com os dados do cartão
                val cardData = hashMapOf(
                    "nickname" to nickname,
                    "number" to cardNumber,
                    "owner" to cardName,
                    "expiration year" to cardYearExpiration,
                    "expiration month" to cardMonthExpiration,
                )

                // Adiciona o cartão ao Firestore
                database.collection("Client_Users").document(user)
                    .collection("CartoesPagamento").add(cardData)
                    .addOnCompleteListener { dataTask ->
                        if (dataTask.isSuccessful) {
                            Toast.makeText(
                                baseContext,
                                "Cadastro do cartão Concluído.",
                                Toast.LENGTH_SHORT
                            ).show()
                            clearData()
                        } else {
                            Toast.makeText(
                                baseContext,
                                "Erro ao cadastrar cartão de pagamento...",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }
            } else {
                Toast.makeText(
                    baseContext,
                    "Erro ao validar os dados do cartão...",
                    Toast.LENGTH_SHORT
                ).show()
            }
        } else {
            Toast.makeText(
                baseContext,
                "Erro ao autênticar o usuário para cadastro do cartão.",
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    // Método para abrir a atividade de saldo
    private fun viewBalanceAct() {
        val intentBack = Intent(applicationContext, BalanceActivity::class.java)
        startActivity(intentBack)
        finish()
    }

    // Método para limpar os campos de entrada após adicionar um cartão
    private fun clearData(){
        binding.nickname.text?.clear()
        binding.NumeroCartao.text?.clear()
        binding.NomeCartao.text?.clear()
        binding.MesAno.text?.clear()
        binding.CVV.text?.clear()
    }
}
