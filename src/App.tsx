import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Chip,
} from '@mui/material';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DIFF_PER_BOTTLE, LINE_ESTIMATE_URL, MAX_BOTTLES, TEXTS, BottleSize } from './constants';
import { validateBottleCount, formatYen } from './utils/validation';

// ============================================================
// テーマ定義
// ============================================================
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a2e',
    },
    secondary: {
      main: '#e94560',
    },
    background: {
      default: '#f8f9fc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '"Hiragino Kaku Gothic ProN"',
      '"Hiragino Sans"',
      'Meiryo',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.02em' },
      },
    },
  },
});

// ============================================================
// 型定義
// ============================================================
type InputState = {
  raw: string;
  value: number;
  error: string | null;
};

type SizeConfig = {
  size: BottleSize;
  label: string;
};

// ============================================================
// 定数
// ============================================================
const SIZE_CONFIGS: SizeConfig[] = [
  { size: '3L', label: '3L' },
  { size: '6L', label: '6L' },
  { size: '15L', label: '15L' },
];

const INITIAL_INPUT: InputState = { raw: '', value: 0, error: null };

// ============================================================
// サブコンポーネント: サイズ入力カード
// ============================================================
interface SizeInputCardProps {
  config: SizeConfig;
  input: InputState;
  onChange: (size: BottleSize, raw: string) => void;
}

function SizeInputCard({ config, input, onChange }: SizeInputCardProps) {
  const unitPrice = DIFF_PER_BOTTLE[config.size];
  const subtotal = unitPrice * input.value;

  return (
    <Card
      elevation={0}
      sx={{
        border: '1.5px solid',
        borderColor: input.value > 0 ? 'secondary.main' : 'divider',
        transition: 'border-color 0.2s ease',
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack spacing={2}>
          {/* ヘッダー行 */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Chip
                label={config.label}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 0.5,
                }}
              />
              <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                特典単価 {formatYen(unitPrice)}/本
              </Typography>
            </Stack>
            {/* 小計 */}
            <Typography
              variant="h6"
              color={input.value > 0 ? 'secondary.main' : 'text.disabled'}
              fontSize="1.1rem"
              sx={{ transition: 'color 0.2s ease' }}
            >
              {formatYen(subtotal)}
            </Typography>
          </Stack>

          {/* 入力行 */}
          <Stack direction="row" alignItems="flex-start" spacing={1.5}>
            <TextField
              type="number"
              inputMode="numeric"
              value={input.raw}
              onChange={(e) => onChange(config.size, e.target.value)}
              placeholder="0"
              error={!!input.error}
              helperText={input.error ?? ' '}
              inputProps={{
                min: 0,
                max: MAX_BOTTLES,
                step: 1,
                style: { fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      本
                    </Typography>
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 140 }}
            />
            {/* 計算式 */}
            <Box sx={{ pt: 1.5, flex: 1 }}>
              <Typography variant="body2" color="text.secondary" fontSize="0.78rem" lineHeight={1.4}>
                {formatYen(unitPrice)} × {input.value}本
              </Typography>
              <Typography variant="body2" color="text.secondary" fontSize="0.78rem">
                = {formatYen(subtotal)}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================
export default function App() {
  const [inputs, setInputs] = useState<Record<BottleSize, InputState>>({
    '3L': INITIAL_INPUT,
    '6L': INITIAL_INPUT,
    '15L': INITIAL_INPUT,
  });

  const handleChange = useCallback((size: BottleSize, raw: string) => {
    const { value, error } = validateBottleCount(raw);
    setInputs((prev) => ({ ...prev, [size]: { raw, value, error } }));
  }, []);

  // 合計計算
  const subtotals = {
    '3L': DIFF_PER_BOTTLE['3L'] * inputs['3L'].value,
    '6L': DIFF_PER_BOTTLE['6L'] * inputs['6L'].value,
    '15L': DIFF_PER_BOTTLE['15L'] * inputs['15L'].value,
  };
  const totalBenefit = subtotals['3L'] + subtotals['6L'] + subtotals['15L'];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100dvh',
          bgcolor: 'background.default',
          py: { xs: 3, sm: 5 },
        }}
      >
        <Container maxWidth="sm">
          <Stack spacing={3}>
            {/* ============ ヘッダー ============ */}
            <Box textAlign="center" sx={{ pb: 1 }}>
              <Typography
                variant="h5"
                component="h1"
                color="primary.main"
                sx={{ fontSize: { xs: '1.35rem', sm: '1.6rem' }, mb: 0.75 }}
              >
                {TEXTS.TITLE}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.85rem',
                  display: 'inline-block',
                  bgcolor: alpha(theme.palette.secondary.main, 0.08),
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                }}
              >
                {TEXTS.SUBTITLE}
              </Typography>
            </Box>

            {/* ============ 入力カード群 ============ */}
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 4 }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  サイズ別 本数を入力
                </Typography>
                <Stack spacing={2}>
                  {SIZE_CONFIGS.map((config) => (
                    <SizeInputCard
                      key={config.size}
                      config={config}
                      input={inputs[config.size]}
                      onChange={handleChange}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>

            {/* ============ 集計カード ============ */}
            <Card
              elevation={0}
              sx={{
                border: '2px solid',
                borderColor: totalBenefit > 0 ? 'secondary.main' : 'divider',
                borderRadius: 4,
                bgcolor: totalBenefit > 0 ? alpha(theme.palette.secondary.main, 0.04) : 'background.paper',
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  特典合計
                </Typography>

                {/* 内訳 */}
                <Stack spacing={0.75} sx={{ mb: 2 }}>
                  {SIZE_CONFIGS.map((config) => (
                    <Stack key={config.size} direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                        {config.label} 特典
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color={subtotals[config.size] > 0 ? 'text.primary' : 'text.disabled'}
                        fontSize="0.9rem"
                      >
                        {formatYen(subtotals[config.size])}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                {/* 合計行 */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontSize="1rem" color="text.primary">
                    合計特典額
                  </Typography>
                  <Typography
                    variant="h5"
                    color={totalBenefit > 0 ? 'secondary.main' : 'text.disabled'}
                    fontWeight={800}
                    fontSize={{ xs: '1.5rem', sm: '1.75rem' }}
                    sx={{ transition: 'color 0.3s ease' }}
                  >
                    {formatYen(totalBenefit)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            {/* ============ CTA ============ */}
            <Button
              component="a"
              href={LINE_ESTIMATE_URL} target="_blank"              onClick={(e) => { e.preventDefault(); const url = LINE_ESTIMATE_URL; if (window.top) { try { window.top.location.href = url; } catch(err) { window.open(url, '_blank'); } } else { window.open(url, '_blank'); } }}
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 2,
                borderRadius: 3,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                bgcolor: '#06C755',
                '&:hover': { bgcolor: '#05a847' },
                boxShadow: '0 4px 20px rgba(6, 199, 85, 0.35)',
              }}
            >
              {TEXTS.CTA_BUTTON}
            </Button>

            {/* フッター注記 */}
            <Typography variant="caption" color="text.disabled" textAlign="center" display="block" sx={{ pb: 1 }}>
              ※ 表示金額は概算です。詳細はLINEにてご確認ください
            </Typography>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
