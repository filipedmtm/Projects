package br.com.puccampinas.kotlin_projetointegrador21

import android.app.PendingIntent
import android.content.Intent
import android.content.IntentFilter
import android.nfc.NdefMessage
import android.nfc.NdefRecord
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.tech.Ndef
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityCleannfcBinding

class NFCCleanActivity : AppCompatActivity() {

    // Declaração do adaptador NFC
    private var nfcAdapter: NfcAdapter? = null
    // Declaração da variável para o binding da ActivityCleannfc
    private lateinit var binding: ActivityCleannfcBinding

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cleannfc)
        binding = ActivityCleannfcBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Configura o clique no botão de retornar
        binding.btnReturn.setOnClickListener {
            managerAct()
        }

        // Inicializa o adaptador NFC
        nfcAdapter = NfcAdapter.getDefaultAdapter(this)

        if (nfcAdapter == null) {
            Toast.makeText(this, "NFC não suportado neste dispositivo", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        if (!nfcAdapter!!.isEnabled) {
            Toast.makeText(this, "NFC desativado", Toast.LENGTH_LONG).show()
        }
    }

    // Método chamado quando uma nova intenção é recebida
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)

        if (intent?.action == NfcAdapter.ACTION_TAG_DISCOVERED) {
            val tag = intent.getParcelableExtra<Tag>(NfcAdapter.EXTRA_TAG)
            tag?.let {
                Toast.makeText(this, "Tag detectada com sucesso", Toast.LENGTH_SHORT).show()
                binding.btnClean.visibility = android.view.View.VISIBLE
                binding.btnClean.setOnClickListener {
                    try {
                        writeTagData(tag)
                        Toast.makeText(this, "NFC limpa com sucesso", Toast.LENGTH_SHORT).show()
                        readTagData(tag)
                    } catch (e: Exception) {
                        Toast.makeText(this, "Não foi possível limpar os dados da TAG NFC.", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    // Método chamado quando a atividade é retomada
    override fun onResume() {
        super.onResume()
        val pendingIntent = PendingIntent.getActivity(this, 0, Intent(this, javaClass).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), PendingIntent.FLAG_MUTABLE)
        val intentFilters = arrayOf(IntentFilter(NfcAdapter.ACTION_TAG_DISCOVERED))
        nfcAdapter?.enableForegroundDispatch(this, pendingIntent, intentFilters, null)
    }

    // Método chamado quando a atividade é pausada
    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableForegroundDispatch(this)
    }

    // Método para escrever dados na tag NFC
    private fun writeTagData(tag: Tag) {
        val ndef = Ndef.get(tag)
        ndef?.connect()

        // Cria uma nova mensagem NDEF vazia
        val newNdefMessage = NdefMessage(NdefRecord(NdefRecord.TNF_EMPTY, null, null, null))

        // Escreve a mensagem NDEF vazia na TAG
        ndef?.writeNdefMessage(newNdefMessage)

        ndef?.close()
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
    private fun managerAct() {
        val intent = Intent(this, ManagerActivity::class.java)
        startActivity(intent)
        finish()
    }
}
