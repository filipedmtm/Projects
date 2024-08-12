package br.com.puccampinas.kotlin_projetointegrador21

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.PorterDuff
import android.graphics.drawable.Drawable
import androidx.annotation.ColorInt
import androidx.annotation.DrawableRes
import androidx.core.content.res.ResourcesCompat
import com.google.android.gms.maps.model.BitmapDescriptor
import com.google.android.gms.maps.model.BitmapDescriptorFactory

// Objeto Singleton para auxiliar na manipulação de bitmaps
object BitmapHelper {

    /**
     * Converte um vetor em um bitmap com o tamanho especificado e, opcionalmente, aplica uma cor.
     *
     * @param context O contexto atual da aplicação.
     * @param id O recurso do vetor a ser convertido em bitmap.
     * @param color A cor a ser aplicada ao bitmap (opcional).
     * @param width A largura desejada do bitmap.
     * @param height A altura desejada do bitmap.
     * @return Um BitmapDescriptor representando o bitmap resultante.
     */
    fun vectorToBitmap(
        context: Context,
        @DrawableRes id: Int,
        @ColorInt color: Int?,
        width: Int,
        height: Int
    ): BitmapDescriptor {
        // Obtém o drawable do vetor a partir do ID do recurso
        val vectorDrawable = ResourcesCompat.getDrawable(context.resources, id, null)
            ?: return BitmapDescriptorFactory.defaultMarker() // Retorna um marcador padrão se o vetor não for encontrado

        // Converte o vetor em um bitmap redimensionado
        val scaledBitmap = Bitmap.createScaledBitmap(
            getBitmapFromVectorDrawable(vectorDrawable),
            width,
            height,
            false
        )

        // Aplica a cor ao bitmap, se especificada
        val finalBitmap = if (color != null) {
            Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888).apply {
                setHasAlpha(true)
                val canvas = Canvas(this)
                canvas.drawBitmap(scaledBitmap, 0f, 0f, null)
                canvas.drawColor(color, PorterDuff.Mode.SRC_ATOP)
            }
        } else {
            scaledBitmap
        }

        // Retorna o bitmap como um BitmapDescriptor
        return BitmapDescriptorFactory.fromBitmap(finalBitmap)
    }

    /**
     * Converte um Drawable em um Bitmap.
     *
     * @param drawable O Drawable a ser convertido em bitmap.
     * @return Um Bitmap resultante da conversão.
     */
    private fun getBitmapFromVectorDrawable(drawable: Drawable): Bitmap {
        // Cria um bitmap com as dimensões do drawable
        val bitmap = Bitmap.createBitmap(
            drawable.intrinsicWidth,
            drawable.intrinsicHeight,
            Bitmap.Config.ARGB_8888
        )
        // Cria um canvas para desenhar no bitmap
        val canvas = Canvas(bitmap)
        // Define os limites do drawable para coincidir com o canvas
        drawable.setBounds(0, 0, canvas.width, canvas.height)
        // Desenha o drawable no canvas, que é vinculado ao bitmap
        drawable.draw(canvas)
        // Retorna o bitmap resultante
        return bitmap
    }
}
