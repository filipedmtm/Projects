package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityLocacaoBinding
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.firestore
import java.util.Calendar

// Atividade para lidar com a locação de armários
class locacaoActivity: AppCompatActivity() {

    private lateinit var binding: ActivityLocacaoBinding
    private lateinit var database: FirebaseFirestore
    private lateinit var auth: FirebaseAuth
    private var selectedPlan: String? = null
    private var selectedLocker: String? = null
    private var dadosLocacao: MutableList<String> = MutableList(4) { "" }
    private lateinit var statusL1: String
    private lateinit var statusL2: String
    private lateinit var statusL3: String
    private lateinit var statusL4: String
    private var dayHour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Inflar o layout usando ViewBinding
        binding = ActivityLocacaoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Obter o ID do armário mais próximo da atividade anterior
        val nearestLockerId = intent.getStringExtra("lockerId")
        Log.d("locacaoActivity", "nearestLockerId: $nearestLockerId")


        // Inicializar o Firebase Firestore e FirebaseAuth
        database = Firebase.firestore
        auth = FirebaseAuth.getInstance()

        // Obter o ID do usuário atualmente autenticado
        auth.currentUser
        val userId = auth.uid

        // Verificar se o usuário está autenticado e exibir informações do armário e opções de planos de locação
        if (userId != null) {
            val documentReference = nearestLockerId?.let {
                database.collection("Lockers").document(it) }
            documentReference?.addSnapshotListener { documentSnapshot, _ ->
                if (documentSnapshot != null && documentSnapshot.exists()) {
                    val name = documentSnapshot.getString("name")
                    val localization = documentSnapshot.getString("loc")
                    val manager = documentSnapshot.getString("manager")

                    binding.lockerName.text = name
                    binding.lockerLocation.text = localization
                    binding.lockerManager.text = manager
                    Log.d("locacaoActivity", "name: $name, localization: $localization, manager: $manager")
                    Log.d("locacaoActivity", "lockerName: ${binding.lockerName.text}, lockerLocation: ${binding.lockerLocation.text}")
                }
            }

            // Obter opções de planos de locação e exibi-las
            val documentReferencePrice = nearestLockerId?.let {
                database.collection("Lockers").document(it).collection("Planos").document("Plans") }
            documentReferencePrice?.addSnapshotListener { documentSnapshot, _ ->
                if (documentSnapshot != null && documentSnapshot.exists()) {
                    val option1 = documentSnapshot.getString("1 hora")
                    val option2 = documentSnapshot.getString("2 horas")
                    val option3 = documentSnapshot.getString("3 horas")
                    val allDay = documentSnapshot.getString("diaria")

                    if(dayHour >= 16){
                        binding.radioButtonPlan3.isEnabled = false
                    }

                    if(dayHour >= 17){
                        binding.radioButtonPlan2.isEnabled = false
                    }

                    binding.radioButtonPlan1.text = "1H: R$ ${option1},00"
                    binding.radioButtonPlan2.text = "2H: R$ ${option2},00"
                    binding.radioButtonPlan3.text = "3H: R$ ${option3},00"
                    if (dailyPlan()) {
                        binding.radioButtonPlan4.text = "Diária: R$ ${allDay},00"
                    }
                    else{
                        binding.radioButtonPlan4.text = "Não disponível"
                        binding.radioButtonPlan4.isEnabled = false
                    }
                }
            }

            val documentReferenceLocker = nearestLockerId?.let {
                database.collection("Lockers").document(it).collection("LockersSize").document("Quantity") }
            documentReferenceLocker?.addSnapshotListener { documentSnapshot, _ ->
                if (documentSnapshot != null && documentSnapshot.exists()) {
                    val locker1 = documentSnapshot.getBoolean("1")
                    val locker2 = documentSnapshot.getBoolean("2")
                    val locker3 = documentSnapshot.getBoolean("3")
                    val locker4 = documentSnapshot.getBoolean("4")

                    if (locker1 == false) {
                        statusL1 = "Disponível"
                    }
                    else{
                        statusL1 = "Ocupado"
                        binding.radioButtonLocker1.isEnabled = false
                    }
                    if (locker2 == false) {
                        statusL2 = "Disponível"
                    }
                    else{
                        statusL2 = "Ocupado"
                        binding.radioButtonLocker2.isEnabled = false
                    }
                    if (locker3 == false) {
                        statusL3 = "Disponível"
                    }
                    else{
                        statusL3 = "Ocupado"
                        binding.radioButtonLocker3.isEnabled = false
                    }
                    if (locker4 == false) {
                        statusL4 = "Disponível"
                    }
                    else{
                        statusL4 = "Ocupado"
                        binding.radioButtonLocker4.isEnabled = false
                    }

                    binding.radioButtonLocker1.text = "Locker 1: ${statusL1} "
                    binding.radioButtonLocker2.text = "Locker 2: ${statusL2} "
                    binding.radioButtonLocker3.text = "Locker 3: ${statusL3} "
                    binding.radioButtonLocker4.text = "Locker 4: ${statusL4} "
                }
            }


            // Adicionar um listener para os botões de rádio
            binding.radioGroupPlanos.setOnCheckedChangeListener { group, checkedId ->
                // Salvar a seleção do radio button na variável
                selectedPlan = when (checkedId) {
                    R.id.radioButtonPlan1 -> binding.radioButtonPlan1.text.toString()
                    R.id.radioButtonPlan2 -> binding.radioButtonPlan2.text.toString()
                    R.id.radioButtonPlan3 -> binding.radioButtonPlan3.text.toString()
                    R.id.radioButtonPlan4 -> binding.radioButtonPlan4.text.toString()
                    else -> null
                }
                Log.d("SelectedPlan", "isSelected: $selectedPlan")
                // Adicionar o plano selecionado à lista
                dadosLocacao[1] = selectedPlan.toString() //posição[1]
                binding.btnPagamento.visibility = if (checkBothRadioGroups()) View.VISIBLE else View.GONE
            }
            // Adicionar um listener para os botões de rádio
            binding.radioGroupLockers.setOnCheckedChangeListener { group, checkedId ->
                // Verificar se algum botão de rádio está selecionado
                val isChecked = checkedId != -1
                Log.d("locacaoActivityLocker", "isChecked: $isChecked")
                // Tornar o botão de pagamento visível apenas se algum botão de rádio estiver selecionado
                binding.btnPagamento.visibility = if (checkBothRadioGroups()) View.VISIBLE else View.GONE

                // Salvar a seleção do radio button na variável
                selectedLocker = when (checkedId) {
                    R.id.radioButtonLocker1 -> "1"
                    R.id.radioButtonLocker2 -> "2"
                    R.id.radioButtonLocker3 -> "3"
                    R.id.radioButtonLocker4 -> "4"
                    else -> null
                }
                Log.d("SelectedLocker", "isSelected: $selectedLocker")

                // Adicionar o locker selecionado à lista
                dadosLocacao[2] = selectedLocker.toString() //posição[2]
            }

            // Adicionar o ID do armário à lista
            dadosLocacao[0] = nearestLockerId.toString() //posição[0]

            // Função para abrir a atividade de pagamento
            fun viewPaymentAct(){
                val intentPagamento = Intent(applicationContext, selectCardActivity::class.java)
                intentPagamento.putExtra("ListaDadosLocacao", dadosLocacao.toTypedArray())
                Log.d("locacaoActivity", "dadosLocacao: $dadosLocacao")
                startActivity(intentPagamento)
                finish()
            }

            // Configurar clique do botão "Pagamento" para abrir a atividade de pagamento
            binding.btnPagamento.setOnClickListener{
                viewPaymentAct()
            }

            // Configurar clique do botão "Voltar" para retornar à atividade de menu principal
            binding.btnBack.setOnClickListener {
                viewMenuAct()
            }
        }
    }

    // Função para verificar se ambos os grupos de botões de rádio têm uma seleção
    private fun checkBothRadioGroups(): Boolean {
        return binding.radioGroupPlanos.checkedRadioButtonId != -1 && binding.radioGroupLockers.checkedRadioButtonId != -1
    }

    // Função para retornar à atividade de menu principal
    private fun viewMenuAct() {
        val intentMain = Intent(applicationContext, MenuActivity::class.java)
        startActivity(intentMain)
        finish()
    }

    private fun dailyPlan(): Boolean{
        return dayHour in 7..8  // 7h às 8h
    }

}
