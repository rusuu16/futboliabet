# Futbolia Bet v3

Bu versiyada Admin panelinə tam kupon idarəetməsi əlavə olunub.

## Admin funksiyaları
- Yeni kupon yaratmaq
- Kuponu silmək
- Kuponu Gəldi / Gəlmədi / Gözləyir etmək
- Kupona oyun əlavə etmək
- Oyunu redaktə etmək
- Oyunu silmək
- Oyunu Gəldi / Gəlmədi / Gözləyir etmək
- Analiz əlavə etmək və silmək

## Database
`database.sql` əvvəlki `matches` cədvəlinə `coupon_id` əlavə edir və `coupons` cədvəlini yaradır. Supabase SQL Editor-da bir dəfə işlət.

## Deployment
Əgər Cloudflare Pages Direct Upload istifadə edirsənsə, bu qovluğun içindəki bütün faylları yeni deployment kimi yüklə.
Əgər GitHub + Cloudflare Pages istifadə edirsənsə, faylları GitHub repository-yə push et, Cloudflare avtomatik deploy edəcək.
