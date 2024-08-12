package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityValidatetwouserBinding
import com.bumptech.glide.Glide
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage

class validadeTwoLocatorActivity : AppCompatActivity() {

    // Classe de dados para armazenar informações sobre os locadores
    data class Locators(
        val image1: String = "",
        val image2: String = "",
        val lockerId: String = "",
        val marker: String = "",
        val plano: String = "",
        val userEmail: String = ""
    )

    private lateinit var binding: ActivityValidatetwouserBinding
    private lateinit var database: FirebaseFirestore
    private lateinit var storage: FirebaseStorage

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityValidatetwouserBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Obtenção do valor passado pela intent
        val dados = intent.getStringExtra("dadosNFC")
        val newDados = dados?.substring(3)

        // Inicialização do Firestore e Firebase Storage
        database = FirebaseFirestore.getInstance()
        storage = FirebaseStorage.getInstance()

        // Exibir os dados recebidos no TextView
        binding.tvNFCMessage.text = newDados

        // Busca os documentos da coleção "Locacoes" no Firestore
        database.collection("Locacoes").get().addOnSuccessListener { result ->
            // Itera sobre cada documento encontrado
            result.forEach { documentSnapshot ->
                Log.e("ValidateOneLocator", "CAIU NA COLECAO")
                var locacoesDocumentsList = mutableListOf<String>()
                locacoesDocumentsList.add(documentSnapshot.id)
                // Converte cada documento em um objeto Locators
                val locacoes = documentSnapshot.toObject(ValidateOneLocatorActivity.Locators::class.java)
                // Verifica se o lockerId do locador corresponde ao valor obtido da intent
                for (i in locacoesDocumentsList) {
                    if (i == newDados) {
                        Log.e("ValidateOneLocator", "CAIU NO IF DA COLECAO")
                        val img1 = locacoes.image1
                        val img2 = locacoes.image2
                        val storageReference = storage.reference
                        val imageReferenceOne = storageReference.child(img1)
                        val imageReferenceTwo = storageReference.child(img2)

                        // Obtém a URL de download da imagem1 e a carrega na ImageView usando Glide
                        imageReferenceOne.downloadUrl.addOnSuccessListener { uri ->
                            Glide.with(this@validadeTwoLocatorActivity).load(uri).into(binding.userOnePhoto)
                        }.addOnFailureListener { exception ->
                            // Registra erros no log caso ocorra falha ao carregar a imagem
                            Log.e("ValidateOneLocator", "Erro ao carregar Imagem", exception)
                            Toast.makeText(this, "Erro ao carregar Imagem do banco", Toast.LENGTH_SHORT).show()
                        }

                        // Obtém a URL de download da imagem2 e a carrega na ImageView usando Glide
                        imageReferenceTwo.downloadUrl.addOnSuccessListener { uri ->
                            Glide.with(this@validadeTwoLocatorActivity).load(uri).into(binding.userTwoPhoto)
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

        // Configura o clique no botão de voltar
        binding.btnBack.setOnClickListener {
            backManagerAct()
        }

        // Configura o clique no botão para prosseguir
        binding.btnProsseguir.setOnClickListener {
            gerenciarArmariosOcupados()
        }
    }

    // Método para retornar à atividade do gerente
    private fun backManagerAct() {
        val intent = Intent(this, ManagerActivity::class.java)
        startActivity(intent)
        finish()
    }

    // Método para navegar para a atividade de gerenciar armários ocupados
    private fun gerenciarArmariosOcupados() {
        val intent = Intent(this, GerenciadorArmariosOcupadosActivity::class.java)
        startActivity(intent)
        finish()
    }
}
