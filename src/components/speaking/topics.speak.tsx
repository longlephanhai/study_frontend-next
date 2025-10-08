'use client'
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Button, Input, List, Typography, Spin, Space, Card } from "antd";

const { TextArea } = Input;
const { Text } = Typography;

interface Message {
  text: string;
  audio: string;
  isUser: boolean;
  timestamp: Date;
}

export default function SpeakingWithAi() {
  const { data: session } = useSession()
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic");

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(recordingIntervalRef.current);
    }

    return () => clearInterval(recordingIntervalRef.current);
  }, [isRecording]);

  const startSession = async () => {
    if (!topic) return;
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/speaking-ai/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ topic }),
      });
      if (!response.ok) throw new Error('Failed to start session');

      const data = await response.json();
      const aiMessage: Message = {
        text: data.text,
        audio: data.audio,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([aiMessage]);
      setIsSessionStarted(true);
      playAudio(data.audio);
    } catch (error) {
      console.error(error);
      alert('Failed to start conversation session');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        sendAudioMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      return recorder;
    } catch (error) {
      console.error(error);
      alert('Cannot access microphone.');
      return null;
    }
  };

  const startRecording = async () => {
    setRecordingTime(0);
    const recorder = await initializeRecording();
    if (recorder) {
      recorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const blobToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const sendAudioMessage = async (audioBlob: Blob) => {
    setIsLoading(true);
    const userAudioUrl = URL.createObjectURL(audioBlob);
    setMessages(prev => [...prev, { text: "[Voice Message]", audio: userAudioUrl, isUser: true, timestamp: new Date() }]);

    try {

      const response = await fetch('http://localhost:8000/api/speaking-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ text: userInput }),
      });
      if (!response.ok) throw new Error('Failed to process voice message');

      const data = await response.json();
      const aiMessage: Message = { text: data.text, audio: data.audio, isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
      playAudio(data.audio);
    } catch (error) {
      console.error(error);
      alert('Voice processing failed. Please use text input.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendTextMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    const msg: Message = { text: userInput, audio: '', isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, msg]);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/speaking-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userInput }),
      });
      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      const aiMessage: Message = { text: data.text, audio: data.audio, isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
      playAudio(data.audio);
    } catch (error) {
      console.error(error);
      alert('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (audioData: string) => {
    if (audioRef.current && audioData) {
      audioRef.current.src = audioData;
      audioRef.current.play().catch(() => { });
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card title={`Speaking Practice${topic ? `: ${topic}` : ''}`} style={{ maxWidth: 800, margin: '2rem auto' }}>
      {!isSessionStarted ? (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="primary" onClick={startSession} loading={isLoading} block disabled={!topic}>
            Start Conversation
          </Button>
          {!topic && <Text type="danger">Please select a topic to start</Text>}
        </Space>
      ) : (
        <>
          <List
            dataSource={messages}
            renderItem={msg => (
              <List.Item style={{ justifyContent: msg.isUser ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '70%' }}>
                  <Card type="inner" style={{ background: msg.isUser ? '#1890ff' : '#f0f0f0', color: msg.isUser ? 'white' : 'black' }}>
                    <Text>{msg.text}</Text>
                    {msg.audio && <Button size="small" type="link" onClick={() => playAudio(msg.audio)}>🔊 Play</Button>}
                    <div style={{ fontSize: 10, marginTop: 4 }}>{msg.timestamp.toLocaleTimeString()}</div>
                  </Card>
                </div>
              </List.Item>
            )}
            style={{ maxHeight: 400, overflowY: 'auto', marginBottom: 16 }}
          />

          <Space style={{ marginBottom: 16 }}>
            {!isRecording ? (
              <Button type="primary" danger onClick={startRecording}>🎙️ Speak</Button>
            ) : (
              <Button onClick={stopRecording}>⏹️ Stop ({formatRecordingTime(recordingTime)})</Button>
            )}
            <Button danger onClick={() => setIsSessionStarted(false)}>End Session</Button>
          </Space>

          <Space direction="vertical" style={{ width: '100%' }}>
            <TextArea
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onPressEnter={sendTextMessage}
              placeholder="Type your response..."
              rows={2}
              disabled={isLoading || isRecording}
            />
            <Button type="primary" onClick={sendTextMessage} loading={isLoading} disabled={!userInput.trim() || isRecording} block>
              Send Text
            </Button>
          </Space>
        </>
      )}
      <audio ref={audioRef} hidden />
    </Card>
  );
}
