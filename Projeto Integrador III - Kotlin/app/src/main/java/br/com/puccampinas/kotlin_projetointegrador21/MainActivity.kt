package br.com.puccampinas.kotlin_projetointegrador21

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityMapaBinding
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.LatLngBounds
import com.google.android.gms.maps.model.MarkerOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import java.util.Calendar

// Classe principal para a atividade do mapa
class MainActivity : AppCompatActivity(), OnMapReadyCallback {

    // Data class para representar um local que possui armários
    data class Place(
        val name: String = "",
        val manager: String = "",
        val prices: String = "",
        val latitude: Double = 0.0,
        val longitude: Double = 0.0,
        val loc: String = ""
    )

    // Código de solicitação de permissão de localização
    private val LOCATION_PERMISSION_REQUEST_CODE = 1
    // Instância do Firebase Firestore
    private val database: FirebaseFirestore = FirebaseFirestore.getInstance()
    private lateinit var auth: FirebaseAuth
    private lateinit var binding: ActivityMapaBinding
    private var dayHour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Inflar o layout usando ViewBinding
        binding = ActivityMapaBinding.inflate(layoutInflater)
        setContentView(binding.root)


        // Inicialização do Firebase Authentication
        auth = FirebaseAuth.getInstance()

        // Inicialização do mapa
        val mapFragment = supportFragmentManager.findFragmentById(R.id.map_fragment) as SupportMapFragment
        mapFragment.getMapAsync(this)

        // Credenciais temporárias para acessar os armários no Firebase
        val email: String = "showmap@gmail.com"
        val password: String = "123456"
        // Tentativa de autenticação com o Firebase Authentication
        auth.signInWithEmailAndPassword(email, password)
            .addOnSuccessListener{
                Toast.makeText(this,"Armários carregados com sucesso", Toast.LENGTH_SHORT).show()
            }
            .addOnFailureListener{
                Toast.makeText(this,"Erro ao carregar mapas", Toast.LENGTH_SHORT).show()
            }


        // Função para retornar à tela de login
        fun backLogin() {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            finish()
        }

        // Função para fazer logout
        fun signOut() {
            auth.signOut()
            backLogin()
        }

        // Configuração do clique do botão "Sair"
        binding.backLogin.setOnClickListener {
            signOut()
        }

    }

    // Método chamado quando o mapa está pronto para uso
    override fun onMapReady(googleMap: GoogleMap) {
        val mMap = googleMap
        enableMyLocation(mMap)
        lockerMark(mMap)
        mMap.setInfoWindowAdapter(MarkerInfoAdapter(this))
    }

    // Método para habilitar a localização atual do usuário no mapa
    private fun enableMyLocation(map: GoogleMap) {
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                LOCATION_PERMISSION_REQUEST_CODE
            )
            return
        }
        map.isMyLocationEnabled = true
    }


    // Método para adicionar marcadores de armários no mapa
    private fun lockerMark(mMap: GoogleMap) {
        // Obtendo os dados dos armários do Firebase Firestore
        database.collection("Lockers").get().addOnSuccessListener { result ->
            val boundsBuilder = LatLngBounds.builder()
            result.forEach { documentSnapshot ->
                val point = documentSnapshot.toObject(Place::class.java)
                val marker = MarkerOptions()
                    .position(LatLng(point.latitude, point.longitude))
                    .title(point.name)
                    .snippet(point.loc)
                    .snippet(point.manager)
                    // Definindo o ícone personalizado para os marcadores
                    .icon(BitmapHelper.vectorToBitmap(this@MainActivity, R.drawable.imagemtransparente, null, 124, 124)) // Definindo o tamanho do ícone para 32x32 pixels
                mMap.addMarker(marker)?.tag = point
                boundsBuilder.include(marker.position)
            }
            val bounds = boundsBuilder.build()
            val cu = CameraUpdateFactory.newLatLngBounds(bounds, 100) // 100 é o padding em pixels
            mMap.moveCamera(cu)
        }
            .addOnFailureListener {
                Toast.makeText(this, "Erro ao atribuir marcador dos armários.", Toast.LENGTH_SHORT).show()
            }

    }

    // Método para validar a hora atual do dia
    private fun validHour(): Boolean {
        // Verifica se a hora atual está entre 7 e 23 horas (das 7 da manhã às 11 da noite)
        return dayHour in 7..23
    }
}
