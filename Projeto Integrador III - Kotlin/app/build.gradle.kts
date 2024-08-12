plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.gms.google-services")
    id("com.google.secrets_gradle_plugin") version "0.5"
}

android {
    namespace = "br.com.puccampinas.kotlin_projetointegrador21"
    compileSdk = 34

    defaultConfig {
        applicationId = "br.com.puccampinas.kotlin_projetointegrador21"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {

    //Implementação da API Camera2
    implementation("androidx.camera:camera-camera2:1.3.3")
    //Implementação do controlador de ciclo de vida da camera
    implementation("androidx.camera:camera-lifecycle:1.3.3")
    //Impletação do objeto Camera View para o Preview
    implementation("androidx.camera:camera-view:1.3.3")
    //Implementação do processamento de imagem BarCodeScan
    implementation ("com.google.mlkit:barcode-scanning:17.2.0")
    // Implementação para conseguir usar o modelo no GooglePlayServices
    implementation ("com.google.android.gms:play-services-mlkit-barcode-scanning:18.3.0")
    implementation ("androidx.navigation:navigation-fragment-ktx:2.4.1")
    implementation ("androidx.navigation:navigation-ui-ktx:2.4.1")
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("androidx.navigation:navigation-fragment-ktx:2.7.7")
    implementation("androidx.navigation:navigation-ui-ktx:2.7.7")
    implementation("com.google.firebase:firebase-auth:22.3.1")
    implementation("com.google.firebase:firebase-firestore-ktx:24.10.3")
    implementation("com.google.firebase:firebase-storage-ktx:19.1.0")
    implementation ("com.squareup.picasso:picasso:2.71828")  // Para carregar a imagem facilmente
    implementation("androidx.activity:activity:1.8.2")
    implementation("com.braintreepayments:card-form:5.4.0")
    implementation("com.google.android.gms:play-services-maps:18.2.0")
    implementation("com.google.android.gms:play-services-location:21.2.0")
    implementation("com.journeyapps:zxing-android-embedded:4.3.0")
    implementation("com.google.zxing:core:3.2.0")
    implementation("androidx.camera:camera-core:1.3.3")
    implementation ("com.github.bumptech.glide:glide:4.12.0")
    implementation ("com.github.bumptech.glide:glide:4.11.0")
    implementation ("com.google.firebase:firebase-firestore:21.7.1")
    implementation ("com.google.firebase:firebase-storage:19.2.1")

    annotationProcessor ("com.github.bumptech.glide:compiler:4.12.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}
