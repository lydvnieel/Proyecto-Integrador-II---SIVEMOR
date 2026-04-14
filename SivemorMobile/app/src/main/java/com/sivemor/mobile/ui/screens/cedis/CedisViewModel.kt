package com.sivemor.mobile.ui.screens.cedis

import androidx.lifecycle.ViewModel
import com.sivemor.mobile.data.model.Cedis
import com.sivemor.mobile.data.repository.AppRepository
import java.util.UUID

class CedisViewModel : ViewModel() {

    fun save(
        client:   String,
        region:   String,
        name:     String,
        address:  String,
        manager:  String,
        email:    String,
        phone:    String,
        altPhone: String
    ): Boolean {
        if (client.isBlank() || region.isBlank() || name.isBlank() ||
            address.isBlank() || manager.isBlank() || email.isBlank() || phone.isBlank()
        ) return false

        AppRepository.addCedis(
            Cedis(
                id       = UUID.randomUUID().toString(),
                client   = client,
                region   = region,
                name     = name,
                address  = address,
                manager  = manager,
                email    = email,
                phone    = phone,
                altPhone = altPhone
            )
        )
        return true
    }
}