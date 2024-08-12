package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityValidateuserBinding
import com.bumptech.glide.Glide
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage

class ValidateOneLocatorActivity : AppCompatActivity() {

    // Classe de dados para armazenar informações sobre os locadores
    data class Locators(
        val image1: String = "",
        val image2: String = "",
        val lockerId: String = "",
        val marker: String = "",
        val plano: String = "",
        val userEmail: String = ""
    )

    // Declaração de variáveis para vinculação de visualizações, Firestore e Firebase Storage
    private lateinit var binding: ActivityValidateuserBinding
    private lateinit var database: FirebaseFirestore
    private lateinit var storage: FirebaseStorage

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityValidateuserBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Obtenção do valor passado pela intent
        val dados = intent.getStringExtra("dadosNFC")
        val newDados = dados?.substring(3)
        //val dado = "pPOpOH4ftysbETYmIbaK"
        // Inicialização do Firestore e Firebase Storage
        database = FirebaseFirestore.getInstance()
        storage = FirebaseStorage.getInstance()

        binding.tvNFCMessage.text = newDados
        // Busca os documentos da coleção "Locacoes" no Firestore
        database.collection("Locacoes").get().addOnSuccessListener { result ->
            // Itera sobre cada documento encontrado
            result.forEach { documentSnapshot ->
                Log.e("ValidateOneLocator", "CAIU NA COLECAO")
                var locacoesDocumentsList = mutableListOf<String>()
                locacoesDocumentsList.add(documentSnapshot.id)
                // Converte cada documento em um objeto Locators
                val locacoes = documentSnapshot.toObject(Locators::class.java)
                // Verifica se o lockerId do locador corresponde ao valor obtido da intent
                for (i in locacoesDocumentsList){
                    if(i == newDados) {
                        Log.e("ValidateOneLocator", "CAIU NO IF DA COLECAO")
                        val img1 = locacoes.image1
//                        val img1= "images/Client_JPEG_1716587250166.jpg"
                        val img2 = locacoes.image2
                        val storageReference = storage.reference
                        val imageReference = storageReference.child(img1)

                        // Obtém a URL de download da imagem e a carrega na ImageView usando Glide
                        imageReference.downloadUrl.addOnSuccessListener { uri ->
                            Glide.with(this@ValidateOneLocatorActivity).load(uri).into(binding.userPhoto)

                        }.addOnFailureListener { exception ->
                            // Registra erros no log caso ocorra falha ao carregar a imagem
                            Log.e("ValidateOneLocator", "Erro ao carregar Imagem", exception)
                            Toast.makeText(this, "Erro ao carregar Imagem do banco", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            }
        }.addOnFailureListener { exception ->
            // Registra erros no log caso ocorra falha ao buscar dados do Firestore
            Log.e("ValidateOneLocator", "Erro ao buscar dado no Firestore", exception)
            Toast.makeText(this, "Erro ao buscar dado no Firestore", Toast.LENGTH_SHORT).show()
        }

        // Configura o botão de voltar para chamar a função backManagerAct
        binding.btnBack.setOnClickListener {
            backManagerAct()
        }

        binding.btnProsseguir.setOnClickListener {
            gerenciarArmariosOcupados()
        }

    }

    // Função para retornar à atividade ManagerActivity
    private fun backManagerAct() {
        val intent = Intent(this, ManagerActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun gerenciarArmariosOcupados() {
        val intent = Intent(this, GerenciadorArmariosOcupadosActivity::class.java)
        startActivity(intent)
        finish()
    }
    //Segunda entrega concluída - gerente.
}
