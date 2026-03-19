package com.sivemor.mobile.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun OptionSelector(
    title: String,
    selected: String,
    options: List<String>,
    onSelected: (String) -> Unit
) {
    androidx.compose.foundation.layout.Column(modifier = Modifier.fillMaxWidth()) {
        Text(text = "$title: $selected")
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.padding(top = 8.dp)
        ) {
            options.forEach { option ->
                AssistChip(
                    onClick = { onSelected(option) },
                    label = { Text(option) }
                )
            }
        }
    }
}
