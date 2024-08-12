package my.application

import android.app.Activity
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

class nfcAdapter : Activity() {

    private var nfcAdapter: NfcAdapter? = null

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Inicializa o adaptador NFC
        nfcAdapter = NfcAdapter.getDefaultAdapter(this)

        // Verifica se o dispositivo suporta NFC
        if (nfcAdapter == null) {
            Toast.makeText(this, "NFC não suportado neste dispositivo.", Toast.LENGTH_LONG).show()
            finish() // Encerra a atividade se NFC não for suportado
        } else if (!nfcAdapter!!.isEnabled) {
            Toast.makeText(this, "NFC desativado.", Toast.LENGTH_LONG).show()
        }
    }

    // Método chamado quando a atividade é retomada
    override fun onResume() {
        super.onResume()
        // Configura a intenção pendente para interceptar tags NFC enquanto a atividade estiver em primeiro plano
        val intent = Intent(this, javaClass).apply {
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_MUTABLE)
        val ndefIntentFilter = IntentFilter(NfcAdapter.ACTION_NDEF_DISCOVERED).apply {
            try {
                addDataType("text/plain")
            } catch (e: IntentFilter.MalformedMimeTypeException) {
                throw RuntimeException("Falha ao adicionar tipo de MIME.", e)
            }
        }
        val intentFiltersArray = arrayOf(ndefIntentFilter)
        nfcAdapter?.enableForegroundDispatch(this, pendingIntent, intentFiltersArray, null)
    }

    // Método chamado quando a atividade é pausada
    override fun onPause() {
        super.onPause()
        nfcAdapter?.disableForegroundDispatch(this)
    }

    // Método chamado quando uma nova intenção é recebida
    @Suppress("DEPRECATION")
    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        if (NfcAdapter.ACTION_NDEF_DISCOVERED == intent.action) {
            val tag = intent.getParcelableExtra<Tag>(NfcAdapter.EXTRA_TAG)
            tag?.let {
                writeNfcMessage("Aqui vai o ID", it) // Escreve a mensagem NFC na tag
            }
        }
    }

    /**
     * Insere o ID do Locker na tag NFC
     *
     * @param lockerId ID do locker
     * @param nfc tag nfc
     *
     * @exception RuntimeException
     */
    private fun writeNfcMessage(lockerId: String, nfc: Tag) {
        val ndef = Ndef.get(nfc) ?: throw RuntimeException("NDEF não suportado nesta tag.")

        try {
            ndef.connect()
            if (!ndef.isWritable) {
                throw RuntimeException("Tag não é gravável.")
            }

            val textRecord = NdefRecord.createTextRecord("pt", lockerId)
            val ndefMessage = NdefMessage(textRecord)

            // Verifica se a tag tem capacidade suficiente
            if (ndef.maxSize < ndefMessage.toByteArray().size) {
                throw RuntimeException("A mensagem é grande demais para a tag NFC.")
            }

            ndef.writeNdefMessage(ndefMessage)
            Toast.makeText(this, "Mensagem escrita na tag NFC!", Toast.LENGTH_LONG).show()
        } catch (e: Exception) {
            Toast.makeText(this, "Falha ao escrever na tag NFC: ${e.message}", Toast.LENGTH_LONG).show()
        } finally {
            if (ndef.isConnected) {
                ndef.close()
            }
        }
    }
}
