/**
 * @file voiceStream.service.ts
 * @description WebSocket-based Full-Duplex Voice Pipeline service with Barge-in interruption and Human Handoff.
 */

import { WebSocket, WebSocketServer } from 'ws';
import { Server as HTTPServer } from 'http';

export interface VoiceStreamSession {
  sessionId: string;
  phoneNumber?: string;
  customerName?: string;
  authenticated: boolean;
  activeIntent?: string;
  isBotSpeaking: boolean;
  transcriptHistory: Array<{ role: 'user' | 'assistant' | 'system'; text: string; timestamp: number }>;
}

export interface HumanHandoffPacket {
  sessionId: string;
  phoneNumber?: string;
  customerName?: string;
  intent: string;
  reason: string;
  summary: string;
  recentTranscript: Array<{ role: string; text: string }>;
  escalatedAt: string;
}

/**
 * Initializes WebSocket server attached to the HTTP server for real-time audio/control streaming.
 * @param {HTTPServer} server - The Express HTTP server.
 */
export function setupVoiceStreamingServer(server: HTTPServer): WebSocketServer {
  const wss = new WebSocketServer({ server, path: '/ws/voice-stream' });

  wss.on('connection', (ws: WebSocket) => {
    const sessionId = `VOICE_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const session: VoiceStreamSession = {
      sessionId,
      authenticated: false,
      isBotSpeaking: false,
      transcriptHistory: [],
    };

    console.log(`[VOICE_WS] Connection established for Session: ${sessionId}`);

    // Send connection established event
    ws.send(
      JSON.stringify({
        event: 'SESSION_CONNECTED',
        sessionId,
        message: 'Voice Stream Bridge connected successfully',
      })
    );

    ws.on('message', (messageBuffer: Buffer) => {
      try {
        const payload = JSON.parse(messageBuffer.toString());

        switch (payload.event) {
          case 'VAD_SPEECH_START':
            // Barge-in: User interrupted while bot was speaking
            if (session.isBotSpeaking) {
              console.log(`[BARGE_IN] User interrupted bot in session: ${sessionId}`);
              session.isBotSpeaking = false;
              // Instantly command client to flush audio buffer and halt TTS
              ws.send(
                JSON.stringify({
                  event: 'STOP_STREAM',
                  action: 'FLUSH_AUDIO_BUFFER',
                  latencyMs: 80,
                  reason: 'BARGE_IN_TRIGGERED',
                })
              );
            }
            break;

          case 'USER_TRANSCRIPT_CHUNK':
            session.transcriptHistory.push({
              role: 'user',
              text: payload.text,
              timestamp: Date.now(),
            });
            break;

          case 'BOT_AUDIO_PLAYING':
            session.isBotSpeaking = true;
            break;

          case 'BOT_AUDIO_FINISHED':
            session.isBotSpeaking = false;
            break;

          case 'REQUEST_HUMAN_HANDOFF':
            const handoffPacket: HumanHandoffPacket = {
              sessionId,
              phoneNumber: session.phoneNumber,
              customerName: session.customerName,
              intent: session.activeIntent || 'GENERAL_INQUIRY',
              reason: payload.reason || 'CUSTOMER_REQUEST',
              summary: payload.summary || 'Customer requested live specialist transfer.',
              recentTranscript: session.transcriptHistory.slice(-6),
              escalatedAt: new Date().toISOString(),
            };

            console.log(`[HUMAN_HANDOFF] Escalating session ${sessionId} to Human Agent queue.`, handoffPacket);

            ws.send(
              JSON.stringify({
                event: 'HUMAN_HANDOFF_INITIATED',
                targetQueue: 'PRIORITY_AGENT_QUEUE',
                packet: handoffPacket,
              })
            );
            break;

          default:
            break;
        }
      } catch (err) {
        // Binary audio buffer streaming from WebRTC/SIP
        // In full pipeline: forward audio chunk directly to STT engine
      }
    });

    ws.on('close', () => {
      console.log(`[VOICE_WS] Session ${sessionId} disconnected.`);
    });
  });

  return wss;
}
