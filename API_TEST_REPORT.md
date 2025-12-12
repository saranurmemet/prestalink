# PrestaLink API Test Report

**Test Tarihi:** 11.12.2025 10:57:55

## Özet

- ✅ Başarılı: 12
- ❌ Başarısız: 0
- ⚠️  Uyarı: 1
- 📊 Toplam: 13

## ✅ Başarılı Testler

1. **GET http://localhost:5000**
   - Status: 200
   - Açıklama: Backend root endpoint

2. **POST http://localhost:5000/api/auth/login**
   - Status: 401
   - Açıklama: General login endpoint

3. **POST http://localhost:5000/api/auth/user/login**
   - Status: 401
   - Açıklama: User login endpoint

4. **POST http://localhost:5000/api/auth/recruiter/login**
   - Status: 401
   - Açıklama: Recruiter login endpoint

5. **POST http://localhost:5000/api/auth/admin/login**
   - Status: 401
   - Açıklama: Admin login endpoint

6. **GET http://localhost:5000/api/jobs**
   - Status: 200
   - Açıklama: Get all jobs

7. **GET http://localhost:5000/api/jobs/invalid-id**
   - Status: 404
   - Açıklama: Get job by invalid ID

8. **GET http://localhost:5000/api/applications/user/invalid-id**
   - Status: 401
   - Açıklama: Get user applications (no auth)

9. **POST http://localhost:5000/api/applications**
   - Status: 401
   - Açıklama: Create application (no auth)

10. **POST http://localhost:5000/api/auth/user/login**
   - Status: 200
   - Açıklama: Sara User login successful

11. **POST http://localhost:5000/api/auth/recruiter/login**
   - Status: 200
   - Açıklama: Sara Recruiter login successful

12. **POST http://localhost:5000/api/auth/admin/login**
   - Status: 200
   - Açıklama: Sara Admin login successful

## ⚠️  Uyarılar

1. **POST http://localhost:5000/api/auth/register**
   - Beklenen: 201,400, Gelen: 400
   - Açıklama: Register endpoint

