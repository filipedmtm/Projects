package br.com.puccampinas.kotlin_projetointegrador21

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import br.com.puccampinas.kotlin_projetointegrador21.databinding.ActivityMenuBinding
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
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

class MenuActivity : AppCompatActivity(), OnMapReadyCallback {

    // Classe de dados para representar um local
    data class Place(
        val name: String = "",
        val manager: String = "",
        val prices: String = "",
        val latitude: Double = 0.0,
        val longitude: Double = 0.0,
        val loc: String = ""
    )

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private val LOCATION_PERMISSION_REQUEST_CODE = 1
    private val database: FirebaseFirestore = FirebaseFirestore.getInstance()
    private lateinit var binding: ActivityMenuBinding
    private var dayHour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
    private lateinit var mMap: GoogleMap
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()

    // Método chamado quando a atividade é criada
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Inicializa o binding com o layout da ActivityMenu
        binding = ActivityMenuBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Inicializa o cliente de localização
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        // Navega para a tela de informações quando o botão de informações é clicado
        binding.infoScreen.setOnClickListener {
            infoSreenAct()
        }

        // Método para efetuar logout e redirecionar para a tela de login
        fun btnExitAct() {
            auth.signOut()
            val intentExit = Intent(applicationContext, LoginActivity::class.java)
            startActivity(intentExit)
            finish()
        }

        // Configura o clique no botão de logout
        binding.btnLogout.setOnClickListener {
            btnExitAct()
        }

        // Configura o clique no botão de saldo
        binding.btnSaldo.setOnClickListener {
            val intentBalance = Intent(applicationContext, BalanceActivity::class.java)
            startActivity(intentBalance)
        }

        // Configura o clique no botão de logout com confirmação
        binding.btnLogout.setOnClickListener {
            AlertDialog.Builder(this)
                .setTitle("Confirmação de Logout") // Define o título do AlertDialog
                .setMessage("Você realmente deseja sair?") // Define a mensagem do AlertDialog
                .setPositiveButton("Sim") { _, _ ->
                    // Realiza o logout quando o botão de confirmação é clicado
                    FirebaseAuth.getInstance().signOut()
                    val intentLogout = Intent(applicationContext, LoginActivity::class.java)
                    startActivity(intentLogout)
                    finish()
                }
                .setNegativeButton("Não", null) // Define o botão de cancelamento do AlertDialog
                .show() // Mostra o AlertDialog
        }

        // Inicializa o fragmento do mapa
        val mapFragment = supportFragmentManager.findFragmentById(R.id.map_fragment) as SupportMapFragment
        mapFragment.getMapAsync(this)
    }

    // Método chamado quando o mapa está pronto para ser usado
    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap
        enableMyLocation(mMap)
        lockerMark(mMap)
        mMap.setInfoWindowAdapter(MarkerInfoAdapter(this))

        // Inicialmente, o botão deve estar invisível
        binding.alugar.visibility = View.GONE

        // Define um listener de clique para os marcadores no mapa
        mMap.setOnMarkerClickListener { marker ->
            marker.showInfoWindow() // Mostra a informação do marcador ao clicar nele
            val nearestLockerId = marker.tag as? String
            if (nearestLockerId != null) {
                if (ActivityCompat.checkSelfPermission(
                        this,
                        Manifest.permission.ACCESS_FINE_LOCATION
                    ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                        this,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                    ) != PackageManager.PERMISSION_GRANTED
                ) {
                    return@setOnMarkerClickListener true
                }
                fusedLocationClient.lastLocation.addOnSuccessListener { userLocation: Location? ->
                    userLocation?.let { location ->
                        val markerLocation = Location("LOCALIZAÇÃO DO ARMÁRIO").apply {
                            latitude = marker.position.latitude
                            longitude = marker.position.longitude
                        }
                        val distance = location.distanceTo(markerLocation)
                        // Torna o botão visível quando um marcador dentro de 500m é clicado
                        if (distance < 500 && validHour()) {
                            // Chama a função que verifica se o usuário tem um cartão cadastrado
                            validCardRegistred { hasCardRegistered ->
                                if (hasCardRegistered) {
                                    binding.alugar.visibility = View.VISIBLE
                                    binding.alugar.setOnClickListener {
                                        val intent = Intent(this, locacaoActivity::class.java)
                                        intent.putExtra("lockerId", nearestLockerId)
                                        startActivity(intent)
                                    }
                                } else {
                                    // Esconde o botão se o usuário não tiver um cartão cadastrado
                                    binding.alugar.visibility = View.GONE
                                }
                            }
                        } else {
                            // Esconde o botão se o marcador clicado estiver fora do alcance de 500m
                            binding.alugar.visibility = View.GONE
                        }
                    } ?: run {
                        Toast.makeText(this, "Não foi possível obter a localização do usuário.", Toast.LENGTH_SHORT).show()
                    }
                }
            }
            true
        }
    }

    // Habilita a localização atual do usuário no mapa
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

    // Marca os armários no mapa e define a lógica de exibição do botão "alugar"
    private fun lockerMark(mMap: GoogleMap) {
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }
        fusedLocationClient.lastLocation.addOnSuccessListener { userLocation: Location? ->
            userLocation?.let { location ->
                database.collection("Lockers").get().addOnSuccessListener { result ->
                    val boundsBuilder = LatLngBounds.builder()
                    result.forEach { documentSnapshot ->
                        val point = documentSnapshot.toObject(Place::class.java)
                        val markerLocation = Location("LOCALIZAÇÃO DO ARMÁRIO").apply {
                            latitude = point.latitude
                            longitude = point.longitude
                        }
                        val markerOptions = MarkerOptions()
                            .position(LatLng(point.latitude, point.longitude))
                            .title(point.name)
                            .snippet("loc: ${point.loc}\nPrices: ${point.prices}")
                            .icon(BitmapHelper.vectorToBitmap(this@MenuActivity, R.drawable.imagemtransparente, null, 124, 124))
                        val marker = mMap.addMarker(markerOptions)
                        marker?.tag = documentSnapshot.id

                        boundsBuilder.include(markerOptions.position)
                    }
                    val bounds = boundsBuilder.build()
                    val camera = CameraUpdateFactory.newLatLngBounds(bounds, 100)
                    mMap.moveCamera(camera)
                }.addOnFailureListener {
                    Toast.makeText(this, "Erro ao atribuir marcador dos armários.", Toast.LENGTH_SHORT).show()
                }
            } ?: run {
                Toast.makeText(this, "Não foi possível obter a localização do usuário.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    // Verifica se a hora atual é válida (entre 7h e 18h)
    private fun validHour(): Boolean {
        return dayHour in 7..18
    }

    // Verifica se o usuário tem um cartão de pagamento cadastrado
    private fun validCardRegistred(callback: (Boolean) -> Unit) {
        val user = auth.currentUser
        if (user != null) {
            val userId = user.uid
            database.collection("Client_Users").document(userId).collection("CartoesPagamento").get().addOnSuccessListener { documentSnapshot ->
                if (documentSnapshot.isEmpty) {
                    callback(false) // Não há cartão cadastrado
                    Toast.makeText(this, "Você precisa cadastrar um cartão de pagamento para alugar um armário.", Toast.LENGTH_SHORT).show()
                } else {
                    callback(true) // Há cartão cadastrado
                }
            }
        }
    }

    // Navega para a tela de informações
    private fun infoSreenAct() {
        val intentInfo = Intent(applicationContext, InfoMenuActivity::class.java)
        startActivity(intentInfo)
        finish()
    }
}
