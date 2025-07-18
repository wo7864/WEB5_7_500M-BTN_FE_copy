import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Button,
  TextField,
  Grid,
  Paper,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  DateTimePicker,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import KakaoMap from "./KakaoMap";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// window.kakao 타입 선언 (ShopMap.tsx 참고)
declare global {
  interface Window {
    kakao: unknown;
  }
}

const KAKAO_API_KEY = "c1ae6914a310b40050898f16a0aebb5f";

interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  x: string;
  y: string;
  category_name?: string;
  place_url?: string;
}

interface PartyCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: any) => void;
}

const PartyCreateDialog: React.FC<PartyCreateDialogProps> = ({
  open,
  onClose,
  onCreate,
}) => {
  // 폼 상태
  const [name, setName] = useState("");
  const [dateTime, setDateTime] = useState<Dayjs | null>(dayjs());
  const [minUserCount, setMinUserCount] = useState(2);
  const [maxUserCount, setMaxUserCount] = useState(5);
  const [selectedShop, setSelectedShop] = useState<KakaoPlace | null>(null);
  const [prevSelectedShop, setPrevSelectedShop] = useState<KakaoPlace | null>(
    null
  );
  const [deadline, setDeadline] = useState<Dayjs | null>(dayjs());
  const [gender, setGender] = useState<string>("전체");
  const [description, setDescription] = useState("");

  // 모드 상태: false=기본(생성폼), true=식당검색
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 카카오맵 관련 상태
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
  const [loading, setLoading] = useState(false);
  // 검색 트리거용 상태
  const [searchTrigger, setSearchTrigger] = useState(0);

  // 파티 생성
  const handleCreate = () => {
    if (!name || !dateTime || !selectedShop) return;
    onCreate?.({
      name,
      dateTime: dateTime.toISOString(),
      deadline: deadline?.toISOString(),
      minUserCount,
      maxUserCount,
      gender,
      description,
      shop: selectedShop,
    });
    onClose();
  };
  console.log(selectedShop);

  // 다이얼로그 닫힐 때 상태 초기화
  useEffect(() => {
    if (!open) {
      setName("");
      setDateTime(dayjs());
      setMinUserCount(2);
      setMaxUserCount(5);
      setSelectedShop(null);
      setKeyword("");
      setSearchResults([]);
      setIsSearchMode(false); // 모드도 초기화
    }
    // eslint-disable-next-line
  }, [open]);

  // 검색 버튼 클릭 시 keyword를 트리거로 넘김
  const handleSearch = () => {
    setSelectedShop(null); // 검색 시 선택 초기화
    setSearchTrigger((prev) => prev + 1);
  };

  // KakaoMap에서 검색 결과를 받아옴
  const handleSearchResults = useCallback((results: any[]) => {
    setSearchResults(results);
  }, []);

  // 검색 결과 지도/마커 표시
  const displayPlaces = (places: KakaoPlace[]) => {
    // 이 함수는 지도 관련 로직을 포함하므로 제거되었습니다.
    // 식당 검색 모드에서는 지도 자체가 없으므로 이 함수는 더 이상 사용되지 않습니다.
  };

  // 지도 중심과 level에 따라 반경(m) 계산
  const getRadiusByLevel = () => {
    // 이 함수는 지도 관련 로직을 포함하므로 제거되었습니다.
    // 식당 검색 모드에서는 지도 자체가 없으므로 이 함수는 더 이상 사용되지 않습니다.
    return 2000; // 기본값
  };

  // 마커/결과 초기화
  const clearMarkers = () => {
    // 이 함수는 지도 관련 로직을 포함하므로 제거되었습니다.
    // 식당 검색 모드에서는 지도 자체가 없으므로 이 함수는 더 이상 사용되지 않습니다.
  };

  // 검색 모드 진입 시 이전 선택값 저장
  const handleEnterSearchMode = () => {
    setPrevSelectedShop(selectedShop);
    setIsSearchMode(true);
  };
  // 뒤로가기(검색모드 종료) 시 이전 선택값 복원
  const handleBackFromSearch = () => {
    setSelectedShop(prevSelectedShop);
    setIsSearchMode(false);
  };
  // 선택 완료 시 현재 선택값을 prevSelectedShop에 반영하고 모드 종료
  const handleSelectComplete = () => {
    setPrevSelectedShop(selectedShop);
    setIsSearchMode(false);
  };

  // KakaoMap에 넘길 값들 useMemo로 최적화
  const mapCenter = useMemo(
    () =>
      selectedShop
        ? { lat: Number(selectedShop.y), lng: Number(selectedShop.x) }
        : undefined,
    [selectedShop]
  );
  const mapMarker = useMemo(
    () =>
      selectedShop
        ? { lat: Number(selectedShop.y), lng: Number(selectedShop.x) }
        : undefined,
    [selectedShop]
  );
  const mapMarkers = useMemo(
    () =>
      selectedShop
        ? [{ lat: Number(selectedShop.y), lng: Number(selectedShop.x) }]
        : searchResults.map((place) => ({
            lat: Number(place.y),
            lng: Number(place.x),
          })),
    [selectedShop, searchResults]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isSearchMode ? "lg" : "sm"}
      fullWidth
    >
      <DialogContent
        sx={{
          p: 0,
          position: "relative",
          minHeight: isSearchMode ? "90vh" : undefined,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
        >
          <CloseIcon />
        </IconButton>
        {/* 모드 분기 */}
        {!isSearchMode ? (
          // 기본 모드: 파티 생성 폼만
          <Box p={4} minWidth={360}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              파티 생성
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="파티명"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="ko"
              >
                <DateTimePicker
                  label="날짜/시간"
                  value={dateTime}
                  onChange={setDateTime}
                  disablePast
                  sx={{ width: "100%" }}
                />
                <DatePicker
                  label="모집 마감일자"
                  value={deadline}
                  onChange={setDeadline}
                  disablePast
                  sx={{ width: "100%", mt: 1 }}
                />
              </LocalizationProvider>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>모집 성별</InputLabel>
                <Select
                  value={gender}
                  label="모집 성별"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem value="전체">전체</MenuItem>
                  <MenuItem value="남자">남자</MenuItem>
                  <MenuItem value="여자">여자</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="모집 내용"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={3}
                maxRows={6}
                sx={{ mt: 1 }}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="최소 인원"
                  type="number"
                  value={minUserCount}
                  onChange={(e) => setMinUserCount(Number(e.target.value))}
                  inputProps={{ min: 2, max: maxUserCount }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="최대 인원"
                  type="number"
                  value={maxUserCount}
                  onChange={(e) => setMaxUserCount(Number(e.target.value))}
                  inputProps={{ min: minUserCount, max: 20 }}
                  sx={{ flex: 1 }}
                />
              </Stack>
              {/* 선택된 식당 요약 */}
              {selectedShop && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f5faff" }}>
                  <Stack alignItems="flex-start">
                    <Typography fontWeight={700} fontSize={16} mb={0.5}>
                      {selectedShop.place_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      {selectedShop.road_address_name ||
                        selectedShop.address_name}
                    </Typography>
                  </Stack>
                </Paper>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={handleEnterSearchMode}
                sx={{ mt: 1 }}
              >
                식당 검색
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={!name || !dateTime || !selectedShop}
                onClick={handleCreate}
                sx={{ mt: 2 }}
              >
                파티 생성하기
              </Button>
            </Stack>
          </Box>
        ) : (
          // 식당 검색 모드
          <Grid container>
            {/* 왼쪽: 검색+리스트 */}
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{
                p: 4,
                borderRight: { md: "1px solid #eee" },
                height: "90vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack direction="row" spacing={1} mb={2}>
                <TextField
                  label="식당 키워드 검색"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  fullWidth
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  검색
                </Button>
              </Stack>
              {/* 검색 결과 리스트: 결과 있을 때만 */}
              {searchResults.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    overflow: "auto",
                    mb: 2,
                    bgcolor: "transparent",
                    boxShadow: "none",
                    border: "none",
                    borderRadius: 0,
                    p: 0,
                  }}
                >
                  <Stack spacing={0}>
                    {searchResults.map((place) => (
                      <Button
                        key={place.id}
                        sx={{
                          justifyContent: "flex-start",
                          textAlign: "left",
                          alignItems: "flex-start",
                          borderBottom: "1px solid #eee",
                          borderRadius: 0,
                          bgcolor:
                            selectedShop?.id === place.id
                              ? "#e3f2fd"
                              : undefined,
                          py: 1.5,
                          px: 1.5,
                          gap: 1,
                          minHeight: 0,
                          boxShadow: "none",
                        }}
                        onClick={() => {
                          setSelectedShop(place);
                        }}
                      >
                        <Stack spacing={0.5} alignItems="flex-start">
                          <Typography fontWeight={700}>
                            {place.place_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {place.road_address_name || place.address_name}
                          </Typography>
                          {place.phone && (
                            <Typography variant="body2" color="text.secondary">
                              전화번호: {place.phone}
                            </Typography>
                          )}
                          {place.category_name && (
                            <Typography variant="body2" color="text.secondary">
                              카테고리: {place.category_name}
                            </Typography>
                          )}
                          {place.place_url && (
                            <Button
                              href={place.place_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              sx={{
                                minWidth: 0,
                                p: 0,
                                color: "primary.main",
                                textTransform: "none",
                                display: "flex",
                                alignItems: "center",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <OpenInNewIcon
                                fontSize="small"
                                sx={{ mr: 0.5 }}
                              />
                              <Typography variant="caption">상세</Typography>
                            </Button>
                          )}
                        </Stack>
                      </Button>
                    ))}
                  </Stack>
                </Paper>
              )}

              <Box flex={1} />
              <Stack direction="row" spacing={1} mt={2}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleBackFromSearch}
                  fullWidth
                >
                  뒤로가기
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!selectedShop}
                  onClick={handleSelectComplete}
                >
                  선택 완료
                </Button>
              </Stack>
            </Grid>
            {/* 오른쪽: 지도만 표시 */}
            <Grid size={{ xs: 12, md: 7 }} sx={{ p: 0 }}>
              <KakaoMap
                center={mapCenter}
                marker={mapMarker}
                markers={mapMarkers}
                zoomLevel={selectedShop ? 1 : 3}
                keyword={searchTrigger > 0 ? keyword : undefined}
                onSearchResults={handleSearchResults}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PartyCreateDialog;
