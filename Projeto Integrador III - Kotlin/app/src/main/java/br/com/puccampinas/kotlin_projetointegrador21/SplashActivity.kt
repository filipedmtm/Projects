package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity

// Classe responsável pela tela de splash
class SplashActivity : AppCompatActivity() {
    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Define o layout da atividade
        setContentView(R.layout.activity_splash)

        // Configura a janela para exibir a tela em modo de tela cheia
        window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        )

        // Utiliza um Handler para postergar a execução de um código por um tempo definido
        Handler(Looper.getMainLooper()).postDelayed({
            // Cria uma Intent para iniciar a atividade de login
            val intent = Intent(this@SplashActivity, LoginActivity::class.java)
            startActivity(intent) // Inicia a atividade de login
            finish() // Encerra a atividade de splash
        }, 2000L) // Atraso de 2000 milissegundos (2 segundos)
    }
}
