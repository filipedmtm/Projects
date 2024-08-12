package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.widget.TextView
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.model.Marker

// Classe responsável por fornecer uma exibição personalizada para as informações do marcador no mapa
class MarkerInfoAdapter(private val context: Context) : GoogleMap.InfoWindowAdapter {

    // Retorna uma exibição de informações personalizada para o marcador
    override fun getInfoWindow(marker: Marker): View? = null

    // Retorna uma exibição personalizada para o conteúdo das informações do marcador
    override fun getInfoContents(marker: Marker): View? {
        // Obtém os dados do marcador do tag associado
        val place = marker.tag as? MainActivity.Place ?: return null

        // Infla o layout personalizado para as informações do marcador
        val view = LayoutInflater.from(context).inflate(R.layout.custom_marker_info, null)

        // Define o título e o endereço do local nos campos de texto do layout personalizado
        view.findViewById<TextView>(R.id.txt_title).text = place.name
        view.findViewById<TextView>(R.id.txt_address).text = place.loc

        return view // Retorna a exibição personalizada com as informações do marcador
    }
}
