package com.example.remotecontrol

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path
import android.view.accessibility.AccessibilityEvent
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import org.json.JSONObject

class RemoteAccessibilityService : AccessibilityService() {

    private var webSocket: WebSocket? = null
    // Replace with your Render or Central Node.js Server URL
    private val serverUrl = "wss://scfi3.onrender.com" 

    override fun onServiceConnected() {
        super.onServiceConnected()
        connectWebSocket()
    }

    private fun connectWebSocket() {
        val client = OkHttpClient()
        val request = Request.Builder().url(serverUrl).build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onMessage(webSocket: WebSocket, text: String) {
                try {
                    val json = JSONObject(text)
                    val action = json.optString("action")

                    when (action) {
                        "CLICK" -> {
                            val x = json.optDouble("x", 500.0).toFloat()
                            val y = json.optDouble("y", 1000.0).toFloat()
                            performClick(x, y)
                        }
                        "HOME" -> {
                            performGlobalAction(GLOBAL_ACTION_HOME)
                        }
                        "SWIPE_UP" -> {
                            performSwipe(500f, 1500f, 500f, 300f)
                        }
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        })
    }

    // Executes exact x,y touches on target phone
    private fun performClick(x: Float, y: Float) {
        val path = Path()
        path.moveTo(x, y)
        val builder = GestureDescription.Builder()
        val gestureDescription = builder
            .addStroke(GestureDescription.StrokeDescription(path, 0, 100))
            .build()
        dispatchGesture(gestureDescription, null, null)
    }

    // Executes swipe gestures
    private fun performSwipe(startX: Float, startY: Float, endX: Float, endY: Float) {
        val path = Path()
        path.moveTo(startX, startY)
        path.lineTo(endX, endY)
        val builder = GestureDescription.Builder()
        val gestureDescription = builder
            .addStroke(GestureDescription.StrokeDescription(path, 0, 300))
            .build()
        dispatchGesture(gestureDescription, null, null)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}
    override fun onInterrupt() {}
}
