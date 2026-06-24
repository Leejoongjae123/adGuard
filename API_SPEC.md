# Whisper STT & OCR API 명세서

## Base URL

```
https://td8h8vtys3.execute-api.ap-northeast-2.amazonaws.com
```

---

## 1. Health Check

서버 상태를 확인합니다.

- **URL**: `/health`
- **Method**: `GET`

### Response

```json
{
  "status": "ok"
}
```

---

## 2. 음성/영상 텍스트 변환 (STT)

영상 또는 오디오 파일을 업로드하면 음성을 텍스트로 변환합니다.

- **URL**: `/transcribe`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### Request Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `file` | File | O | 영상 또는 오디오 파일 |
| `language` | string | X | 언어 코드 (예: `ko`, `en`, `ja`) |

### 지원 파일 형식

| 구분 | 확장자 |
|------|--------|
| 영상 | `.mp4`, `.avi`, `.mkv`, `.mov`, `.wmv`, `.flv`, `.webm` |
| 오디오 | `.mp3`, `.wav`, `.m4a`, `.ogg`, `.flac`, `.webm` |

### 파일 크기 제한

- 최대 **500MB**

### Response (200 OK)

```json
{
  "filename": "interview.mp4",
  "language": "ko",
  "duration": 125.4,
  "text": "안녕하세요 오늘 인터뷰를 시작하겠습니다...",
  "segments": [
    {
      "id": 0,
      "seek": 0,
      "start": 0.0,
      "end": 3.5,
      "text": "안녕하세요",
      "tokens": [50364, 31135, ...],
      "temperature": 0.0,
      "avg_logprob": -0.25,
      "compression_ratio": 1.05,
      "no_speech_prob": 0.01
    }
  ]
}
```

### Response Fields

| 필드 | 타입 | 설명 |
|------|------|------|
| `filename` | string | 업로드한 파일명 |
| `language` | string | 감지된 언어 코드 |
| `duration` | number | 오디오 총 길이 (초) |
| `text` | string | 전체 변환 텍스트 |
| `segments` | array | 구간별 변환 결과 |

### Segment Object

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | number | 구간 인덱스 |
| `start` | number | 시작 시간 (초) |
| `end` | number | 종료 시간 (초) |
| `text` | string | 해당 구간 텍스트 |

---

## 3. 이미지 텍스트 추출 (OCR)

이미지 파일에서 텍스트를 추출합니다.

- **URL**: `/ocr`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

### Request Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `file` | File | O | 이미지 파일 |
| `language` | string | X | 응답 언어 힌트 (예: `ko`, `en`, `ja`) |

### 지원 파일 형식

`.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.webp`, `.tiff`

### 파일 크기 제한

- 최대 **20MB**

### Response (200 OK)

```json
{
  "filename": "receipt.png",
  "text": "스타벅스\n아메리카노 1잔  4,500원\n합계  4,500원"
}
```

### Response Fields

| 필드 | 타입 | 설명 |
|------|------|------|
| `filename` | string | 업로드한 파일명 |
| `text` | string | 추출된 텍스트 |

---

## 에러 응답

모든 API는 에러 발생 시 아래 형식으로 응답합니다.

```json
{
  "detail": "에러 메시지"
}
```

### HTTP 상태 코드

| 코드 | 설명 |
|------|------|
| `400` | 지원하지 않는 파일 형식 |
| `413` | 파일 크기 초과 |
| `500` | 서버 내부 오류 (API 키 미설정, Whisper/OCR 오류 등) |

---

## 프론트엔드 사용 예시

### JavaScript (fetch)

```javascript
// STT 요청
async function transcribe(file, language) {
  const formData = new FormData();
  formData.append('file', file);
  if (language) formData.append('language', language);

  const res = await fetch(
    'https://td8h8vtys3.execute-api.ap-northeast-2.amazonaws.com/transcribe',
    { method: 'POST', body: formData }
  );
  return await res.json();
}

// OCR 요청
async function ocr(file, language) {
  const formData = new FormData();
  formData.append('file', file);
  if (language) formData.append('language', language);

  const res = await fetch(
    'https://td8h8vtys3.execute-api.ap-northeast-2.amazonaws.com/ocr',
    { method: 'POST', body: formData }
  );
  return await res.json();
}
```

### React 예시

```jsx
function FileUpload() {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', 'ko');

    const res = await fetch(
      'https://td8h8vtys3.execute-api.ap-northeast-2.amazonaws.com/transcribe',
      { method: 'POST', body: formData }
    );
    const data = await res.json();
    console.log(data.text);
  };

  return <input type="file" accept="video/*,audio/*" onChange={handleUpload} />;
}
```

### cURL

```bash
# STT
curl -X POST \
  https://td8h8vtys3.execute-api.ap-northeast-2.amazonaws.com/transcribe \
  -F "file=@video.mp4" \
  -F "language=ko"

# OCR
curl -X POST \
  https://td8h8vtys3.execute-api.ap-northeast-2.amazonaws.com/ocr \
  -F "file=@image.png" \
  -F "language=ko"

# Health Check
curl https://td8h8vtys3.execute-api.ap-northeast-2.amazonaws.com/health
```
