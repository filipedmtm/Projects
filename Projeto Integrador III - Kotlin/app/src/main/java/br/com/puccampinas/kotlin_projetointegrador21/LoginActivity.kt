package br.com.puccampinas.kotlin_projetointegrador21

import android.content.ContentValues.TAG
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityLoginBinding
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.auth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.firestore
import java.io.Serializable

// Atividade para login de usuário
class LoginActivity : AppCompatActivity() {

    data class Manager(
        val nome: String = "",
        val email: String = "",
        val cpf: String = "",
        val localidade: String= "",
        val gerenteAtivo: Boolean = false
    ) : Serializable

    private var auth: FirebaseAuth = Firebase.auth
    private lateinit var binding : ActivityLoginBinding
    private var database: FirebaseFirestore = Firebase.firestore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Inflar o layout usando ViewBinding
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Inicializar o FirebaseAuth
        auth = FirebaseAuth.getInstance()

        // Função para abrir a tela do mapa
        fun viewMapAct(){
            val intentMap = Intent(applicationContext, MainActivity:: class.java)
            startActivity(intentMap)
            finish()
        }

        // Função para abrir a tela de recuperação de senha
        fun viewForgotPassAct(){
            val intentFor = Intent(applicationContext, activity_forgot_password:: class.java)
            startActivity(intentFor)
            finish()
        }

        // Função para abrir a tela de registro de usuário
        fun viewRegisterAct(){
            val intentReg = Intent(applicationContext, RegisterActivity:: class.java)
            startActivity(intentReg)
            finish()
        }

        // Função para fazer login no Firebase
        fun loginFirebase(){
            binding.progressBar.visibility = View.VISIBLE
            val email: String = binding.email.text.toString()
            val password: String = binding.password.text.toString()

            auth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(this) { task ->
                    if (task.isSuccessful) {
                        database.collection("Managers").get().addOnSuccessListener{ result ->
                            var isManager = false
                            result.forEach{ documentSnapshot->
                                val manager = documentSnapshot.toObject(Manager::class.java)
                                if(manager.email == email){
                                    isManager = true
                                    if(manager.gerenteAtivo){
                                        binding.progressBar.visibility = View.GONE
                                        //abre o login de gerente.
                                        Log.d(TAG, "Gerente logado com sucesso!")
                                        val managerIntent = Intent(applicationContext, ManagerActivity::class.java)
                                        managerIntent.putExtra("managerInstance", manager)
                                        startActivity(managerIntent)
                                        finish()
                                        return@addOnSuccessListener
                                    }
                                }
                            }
                            if(!isManager){
                                val user = auth.currentUser
                                if (user?.isEmailVerified == true) {
                                    binding.progressBar.visibility = View.GONE
                                    //abre o login de cliente.
                                    Log.d(TAG, "Cliente logado com sucesso!")
                                    val intent = Intent(applicationContext, MenuActivity:: class.java)
                                    startActivity(intent)
                                    finish()
                                }
                                else {
                                    // O e-mail do usuário não foi verificado
                                    binding.progressBar.visibility = View.GONE
                                    Log.d(TAG, "Está caindo nesse IF aqui seu cuzão, verifica direito!!!")
                                    Toast.makeText(baseContext, "Por favor, verifique seu e-mail antes de fazer login.", Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                    }
                    else {
                        // Mensagem de erro ao usuário em caso de falha no login
                        binding.progressBar.visibility = View.GONE
                        Toast.makeText(baseContext, "Erro ao se Conectar.", Toast.LENGTH_SHORT).show()
                    }
                }
        }

        // Função para verificar se os campos de login estão vazios
        fun isEmptyLogin(): Boolean{
            binding.progressBar.visibility = View.VISIBLE
            val email: String = binding.email.text.toString()
            val password: String = binding.password.text.toString()

            if (email.isEmpty()){
                Toast.makeText(this, "Email Faltante", Toast.LENGTH_SHORT).show()
                return false
            }

            if (password.isEmpty()){
                Toast.makeText(this, "Senha Faltante", Toast.LENGTH_SHORT).show()
                return false
            }

            return true
        }

        // Configurar clique do botão "Registrar" para abrir a tela de registro de usuário
        binding.registerView.setOnClickListener{
            viewRegisterAct()
        }

        // Configurar clique do texto "Esqueceu a senha?" para abrir a tela de recuperação de senha
        binding.textforgetPass.setOnClickListener{
            viewForgotPassAct()
        }

        // Configurar clique do texto "Ver mapa" para abrir a tela do mapa
        binding.viewMap.setOnClickListener{
            viewMapAct()
        }

        // Configurar clique do botão "Login" para fazer login no Firebase e verificar campos vazios
        binding.btnLogin.setOnClickListener{
            loginFirebase()
            isEmptyLogin()
        }

    }

    // Método para validar se já existe um usuário logado
    public override fun onStart() {
        super.onStart()

        // Verificar se há um usuário atualmente logado
        val currentUser = auth.currentUser
        if (currentUser != null && currentUser.isEmailVerified) {
            // Se houver, redirecionar para a tela principal do aplicativo
            val intentMenu = Intent(applicationContext, MenuActivity:: class.java)

            startActivity(intentMenu)
            finish()
        }
    }
}
