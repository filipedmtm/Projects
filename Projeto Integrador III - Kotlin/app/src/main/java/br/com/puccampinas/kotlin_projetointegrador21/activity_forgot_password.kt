package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityRecuperarsenhaBinding
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.auth

// Classe da atividade de recuperação de senha
class activity_forgot_password : AppCompatActivity() {

    // Instância do FirebaseAuth para autenticação do Firebase
    private var authReset: FirebaseAuth = Firebase.auth
    private lateinit var binding: ActivityRecuperarsenhaBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Inflar o layout usando o ViewBinding
        binding = ActivityRecuperarsenhaBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Inicializar o FirebaseAuth
        authReset = FirebaseAuth.getInstance()

        // Função para abrir a atividade de login
        fun viewLoginAct(){
            val intentLog = Intent(applicationContext, LoginActivity:: class.java)
            startActivity(intentLog)
            finish()
        }

        // Função para redefinir a senha do usuário
        fun resetPass(){
            val email: String = binding.confirmEmail.text.toString()
            binding.progressBar.visibility = View.VISIBLE
            authReset.sendPasswordResetEmail(email)
                .addOnCompleteListener(this){ task ->
                    binding.progressBar.visibility = View.GONE
                    if(task.isSuccessful){
                        Toast.makeText(this, "Um link para redefinir a senha foi enviado ao Email registrado!", Toast.LENGTH_SHORT).show()
                        binding.confirmEmail.text?.clear()
                        viewLoginAct()
                    }
                    else{
                        Toast.makeText(this, "Erro ao enviar o link... tente novamente!", Toast.LENGTH_SHORT).show()
                    }
                }
        }

        // Função para verificar se os campos de e-mail estão vazios
        fun isEmptyEmails(): Boolean{
            val email: String = binding.confirmEmail.text.toString()
            val confirEmail: String = binding.confirmEmail.text.toString()
            binding.progressBar.visibility = View.VISIBLE
            return if(email.isEmpty()){
                binding.progressBar.visibility = View.GONE
                Toast.makeText(this, "Email faltante... Digite o email registrado.", Toast.LENGTH_SHORT).show()
                false
            }
            else if(confirEmail.isEmpty()){
                binding.progressBar.visibility = View.GONE
                Toast.makeText(this,"Confirmação de email faltando... Confirme o email digitado.", Toast.LENGTH_SHORT).show()
                false
            }
            else{
                binding.progressBar.visibility = View.GONE
                resetPass()
                true
            }
        }

        // Configurar o clique do botão de voltar para o login
        binding.backLogin.setOnClickListener{
            viewLoginAct()
        }

        // Configurar o clique do botão de redefinir senha
        binding.btnResetPass.setOnClickListener{
            isEmptyEmails()
        }
    }
}
