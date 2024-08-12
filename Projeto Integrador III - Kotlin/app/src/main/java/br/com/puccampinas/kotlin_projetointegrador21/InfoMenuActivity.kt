package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityUserinfoBinding
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.auth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.firestore

// Atividade para exibir informações do usuário e fornecer acesso à carteira e outras informações pessoais
class InfoMenuActivity : AppCompatActivity() {

    private var auth: FirebaseAuth = Firebase.auth
    private val database: FirebaseFirestore = Firebase.firestore
    private lateinit var binding: ActivityUserinfoBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Inflar o layout usando ViewBinding
        binding = ActivityUserinfoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Inicializar o FirebaseAuth
        auth = FirebaseAuth.getInstance()

        // Obter o ID do usuário atualmente autenticado
        val userId = auth.uid

        // Se o ID do usuário não for nulo, obter informações do Firestore e exibi-las
        if (userId != null) {
            val documentReference = database.collection("Client_Users").document(userId)
            documentReference.addSnapshotListener { documentSnapshot, _ ->
                if (documentSnapshot!!.exists()) {
                    // exibe na tela as informações do usuario logado
                    binding.nameUser.text = documentSnapshot.getString("nome")
                    binding.cpfUser.text = documentSnapshot.getString("CPF")
                    binding.phoneUser.text = documentSnapshot.getString("telefone")
                }
            }
        }


        // Configurar clique do botão "Voltar" para retornar à atividade de menu principal
        binding.btnBack.setOnClickListener{
            btnBackAct()
        }
    }



    // Método para abrir a atividade de adicionar cartão de crédito (carteira)
    private fun btnWalletAct(){
        val intentWallet = Intent(applicationContext, creditCard_activity::class.java)
        startActivity(intentWallet)
        finish()
    }

    // Método para retornar à atividade de menu principal
    private fun btnBackAct(){
        val intentBack = Intent(applicationContext, MenuActivity::class.java)
        startActivity(intentBack)
        finish()
    }
}
