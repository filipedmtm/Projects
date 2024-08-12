package br.com.puccampinas.kotlin_projetointegrador21

import android.app.DatePickerDialog
import android.content.ContentValues.TAG
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.icu.util.Calendar
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityRegisterBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

// Classe responsável pela funcionalidade de registro de usuários
class RegisterActivity : AppCompatActivity() {

    // Declaração de variáveis para autenticação e acesso ao Firestore
    private var auth: FirebaseAuth = FirebaseAuth.getInstance()
    private val database: FirebaseFirestore = FirebaseFirestore.getInstance()
    private lateinit var binding: ActivityRegisterBinding
    private var mDateSetListener: DatePickerDialog.OnDateSetListener? = null

    // Função chamada quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        auth = FirebaseAuth.getInstance()

        // Função para navegar para a tela de login
        fun viewLoginAct() {
            val intentLog = Intent(applicationContext, LoginActivity::class.java)
            startActivity(intentLog)
            finish()
        }

        // Função para limpar os campos de entrada de dados
        fun cleanData() {
            binding.email.text?.clear()
            binding.password.text?.clear()
            binding.name.text?.clear()
            binding.CPF.text?.clear()
            binding.phoneNumber.text?.clear()
            binding.birthDate.text = null
        }

        // Função para selecionar a data de nascimento do usuário
        fun selectDate() {
            val cal = Calendar.getInstance()
            val year = cal.get(Calendar.YEAR)
            val month = cal.get(Calendar.MONTH)
            val day = cal.get(Calendar.DAY_OF_MONTH)

            val dialog = DatePickerDialog(
                this,
                android.R.style.Theme_Holo_Light_Dialog_MinWidth,
                mDateSetListener,
                year, month, day
            )
            dialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
            dialog.show()
        }

        mDateSetListener = DatePickerDialog.OnDateSetListener { _, year, month, day ->
            val newMonth = month + 1
            Log.d(TAG, "onDateSet: dd/mm/yyyy: $day/$newMonth/$year")

            val date = "$day/$newMonth/$year"
            binding.birthDate.text = date
        }

        // Função para adicionar os dados do usuário ao Firestore
        fun addDataOnFirestore() {
            val user = auth.currentUser
            val email: String = binding.email.text.toString()
            val dataName: String = binding.name.text.toString()
            val dataCPF: String = binding.CPF.text.toString()
            val phoneNumber: String = binding.phoneNumber.text.toString()
            val birthDate: String = binding.birthDate.text.toString()

            val userData = hashMapOf(
                "email" to email,
                "nome" to dataName,
                "CPF" to dataCPF,
                "telefone" to phoneNumber,
                "idade" to birthDate
            )

            val initSaldo = hashMapOf(
                "saldo" to 0
            )

            user?.uid?.let { userId ->
                database.collection("Client_Users").document(userId).set(userData)
                    .addOnCompleteListener { dataTask ->
                        binding.progressBar.visibility = View.GONE
                        if (dataTask.isSuccessful) {
                            Toast.makeText(baseContext, "Cadastro Concluído.", Toast.LENGTH_SHORT).show()
                            cleanData()
                            viewLoginAct()
                        } else {
                            Log.e("Firestore", "Erro ao gravar os dados.", dataTask.exception)
                            Toast.makeText(baseContext, "Erro ao Cadastrar Dados.", Toast.LENGTH_SHORT).show()
                        }
                    }
                database.collection("Client_Users").document(userId).collection("Saldo").document("valor_carteira").set(initSaldo)
                    .addOnCompleteListener { saldoTask ->
                        if (saldoTask.isSuccessful) {
                            Log.d("Firestore", "Saldo inicial gravado com sucesso.")
                        } else {
                            Log.e("Firestore", "Erro ao gravar saldo inicial.", saldoTask.exception)
                        }
                    }
            }
        }

        // Função para validar o formato do e-mail
        fun isValidEmail(email: String): Boolean {
            val emailPattern = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+"
            return email.matches(emailPattern.toRegex())
        }

        // Função para verificar se o e-mail é válido e não está em uso
        fun checkEmailValid(email: String, callback: (Boolean) -> Unit) {
            if (isValidEmail(email)) {
                auth.fetchSignInMethodsForEmail(email).addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        val signInMethods = task.result?.signInMethods
                        if (signInMethods?.isEmpty() == true) {
                            // O e-mail é válido e não está em uso
                            Log.d(TAG, "Email é válido para uso.")
                            callback(true)
                        } else {
                            // O e-mail já está em uso
                            Log.d(TAG, "Email já está em uso.")
                            Toast.makeText(baseContext, "O e-mail já está em uso.", Toast.LENGTH_SHORT).show()
                            callback(false)
                        }
                    } else {
                        // Erro ao verificar o e-mail
                        Toast.makeText(baseContext, "Erro ao verificar o e-mail.", Toast.LENGTH_SHORT).show()
                        callback(false)
                    }
                }
            } else {
                // O e-mail não é válido
                Toast.makeText(baseContext, "O e-mail não é válido.", Toast.LENGTH_SHORT).show()
                callback(false)
            }
        }

        // Função para realizar o registro do usuário no Firebase Authentication
        fun regisFirebase() {
            binding.progressBar.visibility = View.VISIBLE
            val email: String = binding.email.text.toString()
            val password: String = binding.password.text.toString()

            checkEmailValid(email) { isValid ->
                if (isValid) {
                    auth.createUserWithEmailAndPassword(email, password)
                        .addOnCompleteListener(this) { task ->
                            if (task.isSuccessful) {
                                val user = auth.currentUser
                                user?.sendEmailVerification()?.addOnCompleteListener { emailTask ->
                                    if (emailTask.isSuccessful) {
                                        addDataOnFirestore()
                                    } else {
                                        binding.progressBar.visibility = View.GONE
                                        Toast.makeText(baseContext, "Erro ao enviar email de verificação.", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            } else {
                                binding.progressBar.visibility = View.GONE
                                Toast.makeText(baseContext, "Erro ao criar conta autenticada.", Toast.LENGTH_SHORT).show()
                            }
                        }
                } else {
                    binding.progressBar.visibility = View.GONE
                    return@checkEmailValid
                }
            }
        }

        // Função para validar a idade do usuário (entre 14 e 100 anos)
        fun validAge(): Boolean {
            val birthDate: String = binding.birthDate.text.toString() // Pega a data definida no TextView
            val age = birthDate.split("/")[2].toInt() // Divide a String em 3 partes usando delimitador "/" e pega a terceira parte [2] (começa em zero no array) que é o ano. Converte o ano String em Int.
            val currentYear = Calendar.getInstance().get(Calendar.YEAR) // Pega o ano atual
            val userAge = currentYear - age // Calcula a idade do usuário

            if (userAge < 14 || userAge > 100) { // Verifica se a idade é válida
                Log.d(TAG, "Idade inválida.")
                Toast.makeText(this, "Idade inválida. Apenas maiores de 14 anos podem se cadastrar.", Toast.LENGTH_SHORT).show()
                return false
            }
            return true
        }

        // Função para verificar se todos os campos obrigatórios estão preenchidos
        fun isFullFilled(): Boolean {
            val email: String = binding.email.text.toString()
            val password: String = binding.password.text.toString()
            val name: String = binding.name.text.toString()
            val cpf: String = binding.CPF.text.toString()
            val phone: String = binding.phoneNumber.text.toString()
            val birthDate: String = binding.birthDate.text.toString()

            if (email.isEmpty()) {
                Toast.makeText(this, "Email faltante.", Toast.LENGTH_SHORT).show()
                return false
            } else if (password.isEmpty()) {
                Toast.makeText(this, "Senha faltante.", Toast.LENGTH_SHORT).show()
                return false
            } else if (name.isEmpty()) {
                Toast.makeText(this, "Nome faltante.", Toast.LENGTH_SHORT).show()
                return false
            } else if (birthDate.isEmpty()) {
                Log.d(TAG, "Data de Nascimento faltante.")
                Toast.makeText(this, "Data de Nascimento faltante.", Toast.LENGTH_SHORT).show()
                return false
            } else if (cpf.isEmpty()) {
                Toast.makeText(this, "CPF faltante.", Toast.LENGTH_SHORT).show()
                return false
            } else if (phone.isEmpty()) {
                Toast.makeText(this, "Telefone faltante.", Toast.LENGTH_SHORT).show()
                return false
            } else {
                return true
            }
        }

        // Configura o clique no TextView para selecionar a data de nascimento
        binding.birthDate.setOnClickListener {
            selectDate()
        }

        // Navega para a tela de login quando o botão "Já tenho conta" é clicado
        binding.loginNow.setOnClickListener {
            viewLoginAct()
        }

        // Realiza o registro quando o botão "Registrar" é clicado, apenas se os campos estiverem preenchidos corretamente
        binding.btnRegister.setOnClickListener {
            if (isFullFilled() && validAge()) {
                regisFirebase()
            }
        }
    }
}
