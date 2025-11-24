'use client';
import React, { useState, useEffect } from "react";
import { Card, Button, Image, Typography, Progress, Tag, Tooltip, Row, Col } from "antd";
import FlashCardVocabulariesModal from "./flashcard.vocabularies.modal";
import { LeftOutlined, RightOutlined, RotateLeftOutlined, SoundOutlined, PlusOutlined } from "@ant-design/icons";
import FlashCardVocabulariesModalUpdate from "./flashcard.vocabularies.modal.update";

const { Title, Text } = Typography;

interface IProps {
  vocabularies: IFlashCardVocabulary[];
  params?: { id: string };
}

const DisplayVocabularies = ({ vocabularies, params }: IProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);


  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div style={{
        padding: 60,
        textAlign: "center",
        color: "#999",
        fontSize: 16,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          background: "white",
          padding: 40,
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          maxWidth: 400
        }}>
          <Title level={3} style={{ color: "#666", marginBottom: 16 }}>
            Chưa có từ vựng nào
          </Title>
          <Text style={{ color: "#999", display: "block", marginBottom: 24 }}>
            Hãy bắt đầu tạo bộ flashcard đầu tiên của bạn
          </Text>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            style={{
              borderRadius: 8,
              padding: "0 24px",
              height: 40
            }}
          >
            Tạo từ vựng mới
          </Button>
        </div>
        <FlashCardVocabulariesModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          params={params}
        />
      </div>
    );
  }

  const currentCard = vocabularies[currentIndex];

  const nextCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % vocabularies.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevCard = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + vocabularies.length) % vocabularies.length);
      setIsAnimating(false);
    }, 300);
  };

  const toggleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFlipped((prev) => !prev);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const progress = ((currentIndex + 1) / vocabularies.length) * 100;

  const gradientFront = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  const gradientBack = "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";

  return (
    <div style={{
      padding: 24,
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      minHeight: "100vh"
    }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
        <Col>
          <Title level={2} style={{
            margin: 0,
            color: "#2c3e50",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Flashcard
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalUpdateOpen(true)}
            style={{
              borderRadius: 8,
              padding: "0 20px",
              height: 40,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
            }}
          >
            Cập nhật từ vựng
          </Button>
        </Col>
      </Row>

      <div style={{
        maxWidth: 520,
        margin: "0 auto",
        background: "white",
        padding: 32,
        borderRadius: 20,
        boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.2)"
      }}>
        {/* Progress Section */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <Progress
            percent={Math.round(progress)}
            size="small"
            showInfo={false}
            strokeColor={{
              '0%': '#667eea',
              '100%': '#764ba2',
            }}
            trailColor="#f0f0f0"
            style={{ marginBottom: 8 }}
          />
          <Text style={{
            color: "#666",
            fontSize: 14,
            fontWeight: 500
          }}>
            {currentIndex + 1} / {vocabularies.length}
          </Text>
        </div>

        {/* Flash Card */}
        <div
          style={{
            width: "100%",
            height: 320,
            perspective: 1400,
            cursor: "pointer",
            marginBottom: 32,
          }}
          onClick={toggleFlip}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              borderRadius: 16,
            }}
          >
            {/* Front Side */}
            <Card
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 16,
                background: gradientFront,
                color: "white",
                padding: 24,
                border: "none",
                boxShadow: "0 12px 32px rgba(102, 126, 234, 0.3)"
              }}
              bodyStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 0
              }}
            >
              <div style={{ position: "relative", textAlign: "center" }}>
                <Title level={1} style={{
                  color: "white",
                  margin: 0,
                  fontSize: 42,
                  fontWeight: 700,
                  textShadow: "0 2px 8px rgba(0,0,0,0.2)"
                }}>
                  {currentCard.vocabulary}
                </Title>
                {currentCard.pronunciation && (
                  <Text style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 18,
                    marginTop: 12,
                    display: "block",
                    fontWeight: 500
                  }}>
                    /{currentCard.pronunciation}/
                  </Text>
                )}
              </div>

              <div style={{
                position: "absolute",
                bottom: 20,
                left: 0,
                right: 0,
                textAlign: "center"
              }}>
                <Tag style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "none",
                  borderRadius: 20,
                  padding: "4px 16px",
                  fontSize: 12,
                  backdropFilter: "blur(10px)"
                }}>
                  Nhấn để xem nghĩa
                </Tag>
              </div>
            </Card>

            {/* Back Side */}
            <Card
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 16,
                background: gradientBack,
                color: "white",
                padding: 24,
                border: "none",
                boxShadow: "0 12px 32px rgba(245, 87, 108, 0.3)"
              }}
              bodyStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
                gap: 16
              }}
            >
              <Tooltip title="Phát âm">
                <Button
                  type="text"
                  icon={<SoundOutlined />}
                  style={{
                    color: "white",
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontSize: 18
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(currentCard.vocabulary);
                  }}
                />
              </Tooltip>

              <Title level={3} style={{
                color: "white",
                margin: 0,
                textAlign: "center",
                fontSize: 28
              }}>
                {currentCard.vocabulary}
              </Title>

              <div style={{
                background: "rgba(255,255,255,0.15)",
                padding: "16px 20px",
                borderRadius: 12,
                width: "100%",
                textAlign: "center",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)"
              }}>
                <Text strong style={{
                  color: "white",
                  fontSize: 18,
                  lineHeight: 1.4
                }}>
                  {currentCard.meaning}
                </Text>
              </div>

              {currentCard.example && (
                <div style={{
                  textAlign: "center",
                  background: "rgba(255,255,255,0.1)",
                  padding: "12px 16px",
                  borderRadius: 8,
                  width: "100%"
                }}>
                  <Text style={{
                    color: "rgba(255,255,255,0.95)",
                    fontStyle: "italic",
                    fontSize: 14
                  }}>
                    "{currentCard.example}"
                  </Text>
                </div>
              )}

              {currentCard.image && (
                <div style={{ marginTop: 8 }}>
                  <Image
                    src={currentCard.image}
                    alt={currentCard.vocabulary}
                    width={70}
                    height={70}
                    style={{
                      borderRadius: 8,
                      objectFit: "cover",
                      border: "2px solid rgba(255,255,255,0.3)"
                    }}
                    preview={false}
                  />
                </div>
              )}

              <div style={{
                position: "absolute",
                bottom: 20,
                left: 0,
                right: 0,
                textAlign: "center"
              }}>
                <Tag style={{
                  background: "rgba(255,255,255,0.2)",
                  color: "white",
                  border: "none",
                  borderRadius: 20,
                  padding: "4px 16px",
                  fontSize: 12,
                  backdropFilter: "blur(10px)"
                }}>
                  Nhấn để quay lại
                </Tag>
              </div>
            </Card>
          </div>
        </div>

        {/* Controls */}
        <Row justify="center" gutter={16} style={{ marginBottom: 24 }}>
          <Col>
            <Button
              icon={<LeftOutlined />}
              onClick={prevCard}
              size="large"
              style={{
                borderRadius: 10,
                padding: "0 24px",
                height: 44,
                fontSize: 14,
                fontWeight: 500,
                border: "1px solid #d9d9d9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              Trước
            </Button>
          </Col>

          <Col>
            <Tooltip title="Lật thẻ (Space)">
              <Button
                icon={<RotateLeftOutlined />}
                onClick={toggleFlip}
                size="large"
                type="primary"
                style={{
                  borderRadius: 10,
                  width: 44,
                  height: 44,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
                }}
              />
            </Tooltip>
          </Col>

          <Col>
            <Button
              icon={<RightOutlined />}
              onClick={nextCard}
              size="large"
              style={{
                borderRadius: 10,
                padding: "0 24px",
                height: 44,
                fontSize: 14,
                fontWeight: 500,
                border: "1px solid #d9d9d9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              Tiếp
            </Button>
          </Col>
        </Row>

        {/* Instructions */}
        <div style={{ textAlign: "center" }}>
          <Text style={{
            color: "#999",
            fontSize: 12,
            display: "block"
          }}>
            Mẹo: Bấm vào thẻ để lật • Mũi tên trái/phải để chuyển thẻ • Space để lật
          </Text>
        </div>
      </div>

      <FlashCardVocabulariesModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        params={params}
      />

      <FlashCardVocabulariesModalUpdate
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        params={params}
        vocabularies={vocabularies}
      />
    </div>
  );
};

export default DisplayVocabularies;