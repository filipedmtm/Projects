package br.com.puccampinas.kotlin_projetointegrador21

import android.app.PendingIntent
import android.content.Intent
import android.content.IntentFilter
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.tech.Ndef
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityNfcreadBinding

class NFCReadActivity : AppCompatActivity() {
    // Declaração da variável para o binding da ActivityNfcread
    private lateinit var binding: ActivityNfcreadBinding
    // Declaração do adaptador NFC
    private var nfcAdapter: NfcAdapter? = null
    // Declaração da variável para armazenar o ID do documento de locação
    private var hireDocumentId: String? = null

    // Método chamado quando a atividade é iniciada
    override fun onStart() {
        super.onStart()
        // Obtém o ID do documento de locação passado pela intent
        hireDocumentId = intent.getStringExtra("hiredId")
    }

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Inicializa o binding com o layout da ActivityNfcread
        binding = ActivityNfcreadBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Inicializa o adaptador NFC
        nfcAdapter = NfcAdapter.getDefaultAdapter(this)

        if (nfcAdapter == null) {
            Toast.makeText(this, "NFC não suportado", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "NFC suportado", Toast.LENGTH_SHORT).show()
        }

        // Configura o clique no botão de voltar
        binding.btnBack.setOnClickListener {
            backManagerAct()
        }
        // Configura o clique no botão de prosseguir
        binding.btnProsseguir.setOnClickListener {
            val dados = binding.tvNFCMessage.text.toString()
            libLocatorsAct(dados)
        }
    }

    // Método chamado quando uma nova intenção é recebida
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)

        if (intent?.action == NfcAdapter.ACTION_TAG_DISCOVERED) {
            val tag = intent.getParcelableExtra<Tag>(NfcAdapter.EXTRA_TAG)
            tag?.let {
                Toast.makeText(this, "Tag detectada com sucesso", Toast.LENGTH_SHORT).show()
                binding.btnRead.visibility = View.VISIBLE
                binding.btnRead.setOnClickListener {
                    try {
                        val tagData = readTagData(tag)
                        Toast.makeText(this, tagData, Toast.LENGTH_SHORT).show()
                        binding.tvNFCMessage.text = tagData
                        binding.btnProsseguir.visibility = View.VISIBLE
                    } catch (e: Exception) {
                        Toast.makeText(
                            this,
                            "Não foi possível ler os dados da tag.",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            }
        }
    }

    // Método chamado quando a atividade é retomada
    override fun onResume() {
        super.onResume()
        val pendingIntent = PendingIntent.getActivity(
            this, 0, Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), PendingIntent.FLAG_MUTABLE
        )
        val intentFilters = arrayOf(IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED))
        nfcAdapter?.enableForegroundDispatch(this, pendingIntent, intentFilters, null)
    }

    // Método chamado quando a atividade é pausada
    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableForegroundDispatch(this)
    }

    // Método para ler dados da tag NFC
    private fun readTagData(tag: Tag): String {
        val ndef = Ndef.get(tag)
        ndef?.connect()
        val ndefMessage = ndef?.ndefMessage
        ndef?.close()

        val payloadBytes = ndefMessage?.records?.firstOrNull()?.payload
        val payloadText = payloadBytes?.decodeToString() ?: "Nenhum dado encontrado"

        return payloadText
    }

    // Método para retornar à atividade do gerente
    private fun backManagerAct() {
        val intentManager = Intent(this, ManagerActivity::class.java)
        startActivity(intentManager)
        finish()
    }

    // Método para navegar para a atividade de liberação de locadores
    private fun libLocatorsAct(dadosNFC: String) {
        val intent = Intent(this, LibQuantityLocatorsActivity::class.java)
        intent.putExtra("dadosNFC", dadosNFC)
        startActivity(intent)
        finish()
    }
}
