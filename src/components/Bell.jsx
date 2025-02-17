import React, {  useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const BellWrapper = styled.div`
    width: 24px;
    height: 24px;
    margin-left: 407px; /* <li> 태그와의 간격 조절 */
    cursor: pointer;
`;

const NotificationDropdown = styled.div`
    width: 400px;
    position: relative;
    top: 5px;
    right: 360px;
    background: #F6F6F6;
    box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    flex-wrap: wrap;
    padding: 10px 0;
    z-index: 1000;
`;

const NotificationTitle = styled.div`
    display: flex;
    width: 70px;
    height: 49px;
    flex-direction: column;
    justify-content: center;
    color: #000;
    text-align: center;
    font-family: NanumGothic;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 21px; /* 116.667% */
`;

const Divider = styled.div`
    width: 400px;
    height: 1px;
    background-color: #E0E0E0;
    margin: 5px 0 0 0;
`;

const Triangle = styled.svg`
    position: relative;
`;

const NotificationItem = styled.div`
    display: flex;
    justify-content: space-between; /* 텍스트와 버튼 그룹을 양쪽으로 배치 */
    align-items: center; /* 세로 정렬 */
    padding: 10px;
    &:last-child {
        border-bottom: none;
    }
`;

const NotificationText = styled.div`
    width: 80px;
    margin-left: 10px;
    flex-grow: 1;
    color: #333;
    font-family: NanumGothic;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-align: left;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const NotificationButton = styled.button`
    display: flex;
    width: 63px;
    height: 32px;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border: none;
    border-radius: 20px;
    background: #FFF;
    color: #424242;
    font-family: NanumGothic;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 21px; /* 131.25% */

    &:hover {
        background-color: #0D90EE;
        color: #fff;
    }
`;

const NotificationYesButton = styled.button`
    display: flex;
    width: 63px;
    height: 32px;
    padding: 10px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    border: none;
    border-radius: 20px;
    background: #59ABE6;
    color: #FFF;
    font-family: NanumGothic;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 21px; /* 131.25% */

    &:hover {
        background-color: #0D90EE;
    }
`;

const FriendRequestContainer = styled.div`
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Bell = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [userId, setUserId] = useState(null); // 사용자 ID
    const [friendRequests, setFriendRequests] = useState([]);
    const [friendRequestCount, setFriendRequestCount] = useState(0);

    const fetchUserId = async () => {
        try {
            const response = await fetch('https://yeogida.net/mypage/account', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('HTTP 에러 발생:', response.status, errorText);
                throw new Error(`사용자 정보 조회 실패: ${response.status}, ${errorText}`);
            }
    
            const userData = await response.json();
            console.log('사용자 정보:', userData);
            return userData.user_id; // 실제 응답 객체에 따라 user_id를 반환하도록 수정
        } catch (error) {
            console.error('네트워크 오류 발생:', error);
            throw error; // 오류를 호출한 쪽으로 전달
        }
    };    

    const handleBellClick = () => {
        setIsDropdownOpen(!isDropdownOpen); // 드롭다운 열기/닫기 토글
    };

    useEffect(() => {
        let timeout;
        if (!hovered && isDropdownOpen) {
            timeout = setTimeout(() => setIsDropdownOpen(false), 300);
        } else if (hovered) {
            setIsDropdownOpen(true);
            if (timeout) clearTimeout(timeout);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [hovered, isDropdownOpen]);

    // 특정 사용자의 모든 알림 조회
    const fetchUserAlarms = async (userId) => {
        try {
            const response = await fetch(`https://yeogida.net/alarms/${userId}`);
            if (!response.ok) throw new Error(`알림 조회 실패: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API 호출 오류:', error);
        }
    };

    // 여행 상세 API
    const fetchItineraryDetails = async (itinerary_id) => {
        try {
            const response = await fetch(`https://yeogida.net/api/itineraries/${itinerary_id}`);
            
            // 응답이 성공적인 경우
            if (!response.ok) {
                throw new Error('일정 정보를 불러오는 데 실패했습니다.');
            }
    
            const data = await response.json(); // JSON 형태로 변환
            console.log(data); // 데이터 확인
            return data; // 필요한 경우 반환
        } catch (error) {
            console.error('오류:', error);
        }
    };    

    useEffect(() => {
        const loadNotifications = async () => {
            const alarms = await fetchUserAlarms(userId);
            if (alarms) {
                setNotifications(alarms); // 알림을 상태에 저장
            }
        };

        const fetchFriendRequests = async () => {
            console.log("친구 요청 목록을 가져오는 중..."); // API 호출 시작
    
            try {
                const response = await fetch(`https://yeogida.net/mypage/friend/friendrequest`);
                console.log("응답 받음:", response); // 서버에서 응답을 받음
    
                const result = await response.json();
                console.log("JSON 변환 결과:", result); // JSON 데이터로 변환된 결과
    
                if (response.ok) {
                    console.log("요청 성공:", result.data.friendList); // 요청이 성공한 경우
                    setFriendRequests(result.data.friendList);
                    setFriendRequestCount(result.data.friendList.length); // 요청 개수 업데이트
                } else {
                    console.error("요청 실패:", result.message); // 요청이 실패한 경우
                }
            } catch (error) {
                console.error('API 호출 오류:', error); // API 호출 중 오류 발생
            }
        };
    
        loadNotifications();
        fetchFriendRequests();
        fetchUserId();
    }, [userId]); // userId가 변경될 때마다 다시 호출

    // 특정 알림의 상태 업데이트
    const updateAlarmStatus = async (alarmId, newStatus) => {
        try {
            const response = await fetch(`https://yeogida.net/alarms/${alarmId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                const updatedAlarm = await response.json();
                console.log('알림 상태 업데이트 성공:', updatedAlarm);
                return updatedAlarm;
            } else {
                console.error('알림 상태 업데이트 실패');
            }
        } catch (error) {
            console.error('API 호출 오류:', error);
        }
    };

    const handleAccept = async (alarmId, itineraryId) => {
        try {
            // 1. 알림 상태 업데이트
            const updatedAlarm = await updateAlarmStatus(alarmId, 'accepted'); // 상태를 'accepted'로 변경
            
            if (!updatedAlarm) {
                console.error("알림 상태 업데이트 실패");
                return;
            }
    
            // 2. 일정 상세 정보 가져오기
            const itineraryData = await fetchItineraryDetails(itineraryId);
    
            if (!itineraryData) {
                console.error("일정 정보를 가져오는 데 실패했습니다.");
                return;
            }
    
            // 3. 사용자의 여행에 일정 추가
            const addToItineraryResponse = await fetch(`https://yeogida.net/api/itineraries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itineraryData), // 가져온 일정 정보를 바디에 포함
            });
    
            if (addToItineraryResponse.ok) {
                console.log("일정이 여행에 추가되었습니다.");
            } else {
                console.error("일정 추가 실패");
            }
        } catch (error) {
            console.error("일정 수락 오류:", error);
        }
    };    

    // 특정 알림 삭제
    const handleReject = async (alarmId) => {
        try {
            const response = await fetch(`https://yeogida.net/alarms/${alarmId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('알림 삭제 성공');
                return true;
            } else {
                console.error('알림 삭제 실패');
                return false;
            }
        } catch (error) {
            console.error('API 호출 오류:', error);
        }
    };

    return (
        <BellWrapper
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
            onClick={handleBellClick}
        >
            {hovered ? (
                isDropdownOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20.5196 15.2116L18.7196 13.4016V8.9416C18.7435 7.28543 18.1674 5.67651 17.0977 4.41194C16.028 3.14737 14.5368 2.31254 12.8996 2.0616C11.9494 1.93647 10.9834 2.01542 10.0662 2.29318C9.14893 2.57094 8.30146 3.04113 7.58031 3.67236C6.85916 4.3036 6.28093 5.08138 5.88419 5.9538C5.48745 6.82622 5.28133 7.77321 5.27958 8.7316V13.4016L3.47958 15.2116C3.25349 15.4415 3.10017 15.7329 3.03879 16.0494C2.9774 16.3659 3.01068 16.6935 3.13446 16.9912C3.25824 17.289 3.46704 17.5436 3.73474 17.7233C4.00244 17.903 4.31717 17.9998 4.63958 18.0016H7.99958V18.3416C8.04629 19.3568 8.49354 20.3121 9.24331 20.9981C9.99308 21.6842 10.9842 22.045 11.9996 22.0016C13.0149 22.045 14.0061 21.6842 14.7559 20.9981C15.5056 20.3121 15.9529 19.3568 15.9996 18.3416V18.0016H19.3596C19.682 17.9998 19.9967 17.903 20.2644 17.7233C20.5321 17.5436 20.7409 17.289 20.8647 16.9912C20.9885 16.6935 21.0218 16.3659 20.9604 16.0494C20.899 15.7329 20.7457 15.4415 20.5196 15.2116V15.2116ZM13.9996 18.3416C13.9441 18.8226 13.7052 19.2637 13.3327 19.5729C12.9601 19.8821 12.4826 20.0357 11.9996 20.0016C11.5166 20.0357 11.0391 19.8821 10.6665 19.5729C10.2939 19.2637 10.055 18.8226 9.99958 18.3416V18.0016H13.9996V18.3416Z" fill="black"/>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20.5196 15.2116L18.7196 13.4016V8.9416C18.7435 7.28543 18.1674 5.67651 17.0977 4.41194C16.028 3.14737 14.5368 2.31254 12.8996 2.0616C11.9494 1.93647 10.9834 2.01542 10.0662 2.29318C9.14893 2.57094 8.30146 3.04113 7.58031 3.67236C6.85916 4.3036 6.28093 5.08138 5.88419 5.9538C5.48745 6.82622 5.28133 7.77321 5.27958 8.7316V13.4016L3.47958 15.2116C3.25349 15.4415 3.10017 15.7329 3.03879 16.0494C2.9774 16.3659 3.01068 16.6935 3.13446 16.9912C3.25824 17.289 3.46704 17.5436 3.73474 17.7233C4.00244 17.903 4.31717 17.9998 4.63958 18.0016H7.99958V18.3416C8.04629 19.3568 8.49354 20.3121 9.24331 20.9981C9.99308 21.6842 10.9842 22.045 11.9996 22.0016C13.0149 22.045 14.0061 21.6842 14.7559 20.9981C15.5056 20.3121 15.9529 19.3568 15.9996 18.3416V18.0016H19.3596C19.682 17.9998 19.9967 17.903 20.2644 17.7233C20.5321 17.5436 20.7409 17.289 20.8647 16.9912C20.9885 16.6935 21.0218 16.3659 20.9604 16.0494C20.899 15.7329 20.7457 15.4415 20.5196 15.2116V15.2116ZM13.9996 18.3416C13.9441 18.8226 13.7052 19.2637 13.3327 19.5729C12.9601 19.8821 12.4826 20.0357 11.9996 20.0016C11.5166 20.0357 11.0391 19.8821 10.6665 19.5729C10.2939 19.2637 10.055 18.8226 9.99958 18.3416V18.0016H13.9996V18.3416Z" fill="black"/>
                    </svg>
                )
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5.92827 8.32543C6.09393 6.8613 6.805 5.50846 7.92536 4.52588C9.04572 3.54329 10.4967 3 12.0004 3C13.5042 3 14.9551 3.54329 16.0755 4.52588C17.1958 5.50846 17.9069 6.8613 18.0726 8.32543L18.3482 10.7532L18.3547 10.8142C18.4959 12.0185 18.8963 13.1797 19.5293 14.2212L19.5622 14.2748L20.1932 15.3065C20.7674 16.2429 21.0539 16.7111 20.9916 17.0958C20.9504 17.3511 20.8164 17.5832 20.6143 17.7493C20.3091 18 19.7514 18 18.6369 18H5.36393C4.24837 18 3.69059 18 3.38655 17.7504C3.18378 17.5841 3.04935 17.3516 3.00813 17.0958C2.94689 16.7111 3.23343 16.2429 3.80652 15.3065L4.43977 14.2737L4.47258 14.2202C5.10512 13.1789 5.50509 12.0181 5.6461 10.8142L5.65266 10.7532L5.92827 8.32543Z" stroke="black" strokeWidth="2"/>
                    <path d="M9 18C9 19.0609 9.31607 20.0783 9.87868 20.8284C10.4413 21.5786 11.2044 22 12 22C12.7956 22 13.5587 21.5786 14.1213 20.8284C14.6839 20.0783 15 19.0609 15 18" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            )}
            {isDropdownOpen && (
                <>
                    <Triangle xmlns="http://www.w3.org/2000/svg" width="29" height="16" viewBox="0 0 29 16" fill="#F6F6F6">
                        <path d="M14.5 0L28.7894 15.75H0.210581L14.5 0Z" />
                    </Triangle>
                    <NotificationDropdown>
                        <NotificationTitle>알림</NotificationTitle>
                        <Divider />
                        {friendRequestCount > 0 ? (
                            <FriendRequestContainer>
                                <NotificationText>새로운 친구 요청이 {friendRequestCount}개 있습니다.</NotificationText>
                                <NotificationButton onClick={() => navigate('/mypage/friend')}>확인</NotificationButton>
                            </FriendRequestContainer>
                        )  : null }
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <NotificationItem key={index}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                        <circle cx="15" cy="15" r="15" fill="#D9D9D9" />
                                    </svg>
                                    <NotificationText>{notification.friendId}</NotificationText>
                                    <NotificationText>{notification.message}</NotificationText>
                                    <ButtonContainer>
                                        <NotificationYesButton onClick={() => handleAccept(notification.id)}>수락</NotificationYesButton>
                                        <NotificationButton onClick={() => handleReject(notification.id)}>거절</NotificationButton>
                                    </ButtonContainer>
                                </NotificationItem>
                            ))
                        ) : (
                            <NotificationItem>
                                <NotificationText>새로운 알림이 없습니다.</NotificationText>
                            </NotificationItem>
                        )}
                    </NotificationDropdown>
                </>
            )}
        </BellWrapper>
    );
};

export default Bell;