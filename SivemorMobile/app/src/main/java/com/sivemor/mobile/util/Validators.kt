package com.sivemor.mobile.util

import android.util.Patterns

object Validators {
    fun isValidEmail(value: String): Boolean {
        return Patterns.EMAIL_ADDRESS.matcher(value).matches()
    }
}
