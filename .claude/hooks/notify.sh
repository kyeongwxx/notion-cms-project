#!/bin/bash

# stdin에서 JSON 입력 받기 (Stop 이벤트는 특별한 정보 없음)
input=$(cat)

# macOS 시스템 알림 발송
if command -v osascript &> /dev/null; then
  osascript -e 'display notification "응답 완료" with title "Claude"'
fi

exit 0
