package com.example.videocallapp

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.core.app.ActivityCompat
import com.google.firebase.ktx.Firebase
import com.google.firebase.ktx.initialize
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    var permissions = arrayOf(Manifest.permission.CAMERA, Manifest.permission.RECORD_AUDIO)
    var requestCode = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        if (!isPermissionGranted()) {
            askPermission()
        }

        Firebase.initialize(this)
        loginButton.setOnClickListener {
            var username = usernameEdit.text.toString()
            var intent = Intent(this, CallActivity::class.java)
            intent.putExtra("username", username)
            startActivity(intent)
        }
    }

    private fun askPermission() {
        ActivityCompat.requestPermissions(this, permissions, requestCode)
    }

    private fun isPermissionGranted(): Boolean {

        permissions.forEach {
            if (ActivityCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED)
                return false
        }

        return true
    }
}
