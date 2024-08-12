package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivitySelecaocartoesBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.google.zxing.BarcodeFormat
import com.google.zxing.WriterException
import com.google.zxing.qrcode.QRCodeWriter

// Classe responsável pela seleção do cartão de pagamento e geração do código QR
class selectCardActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySelecaocartoesBinding
    private lateinit var database: FirebaseFirestore
    private lateinit var auth: FirebaseAuth
    private var selectedCard: String? = null
    private var locacaoDocumentId: String? = null
    private var dadosLocacao: MutableList<String>? = null
    private var dadosLocacaoArray: Array<String>? = null
    private var dadosLocacaoString: String? = null

    // Data classes para representar o cartão e informações do armário
    data class Cartao(
        val expirationYear: String = "",
        val expirationMonth: String = "",
        val nickname: String = "",
        val cardNumber: String = "",
        val owner: String = "",
    )

    // Função chamada quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySelecaocartoesBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Inicialização do Firebase e obtenção do ID do usuário atual
        database = Firebase.firestore
        auth = FirebaseAuth.getInstance()
        val userId = auth.uid
        val userEmail = auth.currentUser?.email

        // Obtenção do ID do armário mais próximo passado pela atividade anterior
        dadosLocacaoArray = intent.getStringArrayExtra("ListaDadosLocacao")
        Log.d("Dados recebidos", "dadosLocacao: $dadosLocacaoArray")
        dadosLocacao = dadosLocacaoArray?.toMutableList()
        dadosLocacao?.set(3, userEmail.toString())
        Log.d("Dados convertidos", "dadosLocacao: $dadosLocacao")
        dadosLocacaoString = dadosLocacao?.joinToString(separator = "/")
        Log.d("Dados convertidos", "dadosLocacaoString: $dadosLocacaoString")

//      Obtendo dado [0] ID do locker selecionado.
        val lockerId = dadosLocacao?.get(0)
        //Obtendo dado [1] plano selecionado.
        val plano = dadosLocacao?.get(1)
        //Obtendo dado [2] que é o locker selecionado.
        val locker = dadosLocacao?.get(2)
//      Obtendo dado [3] que é o userId selecionado.
        val dadouserId = dadosLocacao?.get(3)

        // Verificação se o ID do usuário e do armário são válidos
        if (userId != null && dadosLocacao != null) {
            // Lista para armazenar os apelidos dos cartões de pagamento do usuário
            val nickList: MutableList<String> = mutableListOf()

            // Obtenção dos cartões de pagamento do usuário a partir do Firestore
            database.collection("Client_Users").document(userId).collection("CartoesPagamento")
                .get().addOnSuccessListener { result ->
                    result.forEach { documentSnapshot ->
                        val card = documentSnapshot.toObject(Cartao::class.java)
                        nickList.add(card.nickname)
                    }

                    // Popula o spinner com os apelidos dos cartões
                    binding.spinnerCard.adapter = ArrayAdapter(
                        this,
                        android.R.layout.simple_spinner_item,
                        nickList
                    )
                }
        }

        binding.spinnerCard.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                // Salvar a seleção do cartão na variável
                selectedCard = parent.getItemAtPosition(position).toString()
            }

            override fun onNothingSelected(parent: AdapterView<*>) {
                Log.d("Erro ao atribuir cartão", "na função de adicionar o cartão do spinner em uma váriável, houve um erro..." )
            }
        }

        // Atualizar o Firestore com a quantidade de armários disponíveis
        fun atualizarQuantidade() {
            if (lockerId != null) {
                database.collection("Lockers").document(lockerId).collection("LockersSize").document("Quantity").update(
                    locker.toString(), true
                )
            }
        }

        // Configuração dos listeners para os botões "Voltar" e "Pagamento"
        binding.btnBack.setOnClickListener {
            backToMenu()
        }

        binding.btnPagamento.setOnClickListener {
            atualizarQuantidade()
            QrCode()
        }
    }

    // Função para gerar o código QR com a localização do armário
    private fun QrCode() {
        val opcao = dadosLocacaoString

        if (opcao != null) {
            if (opcao.isNotEmpty()) {
                val writer = QRCodeWriter()
                try {
                    val bitMatrix =
                        writer.encode(opcao, BarcodeFormat.QR_CODE, 512, 512)
                    val width = bitMatrix.width
                    val height = bitMatrix.height
                    val bmp = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565)
                    for (x in 0 until width) {
                        for (y in 0 until height) {
                            bmp.setPixel(
                                x,
                                y,
                                if (bitMatrix[x, y]) Color.BLACK else Color.WHITE
                            )
                        }
                    }
                    binding.btnPagamento.visibility = View.GONE
                    binding.ivQRCode.setImageBitmap(bmp)
                } catch (e: WriterException) {
                    e.printStackTrace()
                }
            } else {
                // Lógica para lidar com a opção vazia, se necessário
            }
        }
    }

    // Função para navegar de volta para o menu principal
    private fun backToMenu() {
        val intentMenu = Intent(applicationContext, MenuActivity::class.java)
        startActivity(intentMenu)
        finish()
    }
}
