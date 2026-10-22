# TypeRace --- Kế hoạch phát triển sản phẩm chi tiết

**Phiên bản tài liệu:** 1.0\
**Ngày lập:** 22/10/2026\
**Mục tiêu:** Xây dựng một web game đua tốc độ gõ phím, ưu tiên chi phí
gần 0 đồng, dễ chia sẻ, có thể phát triển thành sản phẩm kiếm tiền.

------------------------------------------------------------------------

## 1. Tóm tắt dự án

TypeRace là web game nơi người chơi gõ cùng một đoạn văn để điều khiển
phương tiện chạy trên đường đua. Mỗi người thiết lập nickname, chọn icon
phương tiện (ô tô, xe đua, mô tô, tên lửa, thuyền...) và màu nhận diện
trước khi vào phòng. Khi chủ phòng bắt đầu, tất cả người chơi cùng đua;
tiến độ gõ được biểu diễn bằng vị trí phương tiện trên đường đua.

### Giá trị cốt lõi

-   Mở link là chơi, không bắt buộc đăng ký tài khoản.
-   Có cảm giác đua thật: phòng chờ, đếm ngược 3--2--1, phương tiện di
    chuyển, vạch đích, kết quả.
-   Dễ thách đấu bạn bè qua link phòng hoặc mã phòng.
-   Có thẻ kết quả đẹp để chia sẻ lên Zalo, Messenger, Discord hoặc mạng
    xã hội.
-   Chạy tốt trên máy tính trước; hỗ trợ màn hình điện thoại ở mức phù
    hợp.

### Nguyên tắc sản phẩm

1.  Hoàn thiện trải nghiệm đua trước khi thêm nhiều tính năng phụ.
2.  Ưu tiên luật chơi dễ hiểu và công bằng.
3.  Không yêu cầu tài khoản trong MVP.
4.  Không cần AI API hoặc dịch vụ trả phí để chạy phiên bản đầu.
5.  Thiết kế theo hướng có thể thay backend sau này mà không viết lại
    toàn bộ game.

------------------------------------------------------------------------

## 2. Mục tiêu, chỉ số và tiêu chí thành công

### Mục tiêu MVP

Người dùng có thể: 1. Mở trang web và luyện gõ một mình. 2. Thiết lập
tên, phương tiện, màu sắc. 3. Tạo phòng và gửi link cho bạn. 4. Tham gia
phòng bằng link hoặc mã. 5. Cùng đua trên một đoạn văn. 6. Xem WPM, độ
chính xác, thời gian và thứ hạng. 7. Chơi lại hoặc chia sẻ kết quả.

### Chỉ số cần theo dõi

Trong giai đoạn đầu có thể ghi nhận thủ công, không cần analytics phức
tạp: - Số người mở trang. - Số lượt bắt đầu bài gõ. - Tỷ lệ người hoàn
thành cuộc đua. - Số phòng được tạo. - Số người trung bình trong một
phòng. - Tỷ lệ người chơi gửi link mời. - Tỷ lệ người nhận link thực sự
tham gia. - Tỷ lệ người quay lại trong 7 ngày. - Lỗi kết nối, số lần mất
đồng bộ và thời gian tải trang.

### Tiêu chí MVP được xem là đạt

-   Người mới có thể vào chơi mà không cần hướng dẫn trực tiếp.
-   Hai đến tám người có thể hoàn thành một cuộc đua cùng nội dung.
-   Kết quả không bị sai khi người chơi gõ nhanh, sửa lỗi hoặc dùng bộ
    gõ tiếng Việt.
-   Nếu một người rời phòng, những người khác vẫn tiếp tục được.
-   Link mời hoạt động ổn định khi mở ở cửa sổ trình duyệt khác.
-   Website dùng được trên Chrome và Edge bản hiện đại.
-   Không phát sinh chi phí bắt buộc trong quá trình phát triển và thử
    nghiệm nhỏ; các giới hạn miễn phí của nhà cung cấp cần được kiểm tra
    trước khi phát hành.

------------------------------------------------------------------------

## 3. Đối tượng người dùng

### Nhóm ưu tiên

-   Học sinh, sinh viên thích trò chơi ngắn và thi đua với bạn.
-   Nhóm bạn muốn có trò chơi nhanh trong giờ giải lao.
-   Người học tiếng Anh muốn luyện tốc độ gõ.
-   Lập trình viên và người dùng máy tính muốn kiểm tra WPM.
-   Giáo viên hoặc câu lạc bộ muốn tổ chức thử thách gõ phím.

### Tình huống sử dụng chính

-   Một người tạo phòng rồi gửi link vào nhóm chat.
-   Bạn bè vào phòng, chọn nickname và phương tiện.
-   Chủ phòng chọn bài, đợi người chơi sẵn sàng rồi bắt đầu.
-   Cả phòng cùng gõ; xe chạy theo tiến độ của từng người.
-   Kết quả hiện ra, người chơi chụp/chia sẻ và thách đấu lượt tiếp
    theo.

### Không nhắm tới trong MVP

-   Hệ thống giải đấu chuyên nghiệp.
-   Xếp hạng toàn cầu có chống gian lận nâng cao.
-   Chat tự do trong phòng.
-   Tài khoản, bạn bè, hồ sơ người dùng phức tạp.
-   Cửa hàng vật phẩm, thanh toán và vật phẩm có chỉ số ảnh hưởng kết
    quả.

------------------------------------------------------------------------

## 4. Phạm vi tính năng

### P0 --- Bắt buộc có trong MVP

-   Trang chủ.
-   Chế độ luyện tập một người.
-   Thiết lập nickname.
-   Chọn icon phương tiện và màu nhận diện.
-   Tạo phòng.
-   Tham gia bằng link hoặc mã phòng.
-   Danh sách người chơi và trạng thái sẵn sàng.
-   Chủ phòng chọn nội dung, độ dài và chủ đề đường đua.
-   Đồng hồ đếm ngược đồng bộ.
-   Giao diện đường đua có vị trí từng phương tiện.
-   Bộ gõ và tính WPM/độ chính xác.
-   Màn hình kết quả.
-   Chơi lại.
-   Sao chép link mời.
-   Xử lý trường hợp người chơi mất kết nối hoặc rời phòng.
-   Hướng dẫn cơ bản, thông báo lỗi dễ hiểu.

### P1 --- Nên có sau khi P0 ổn định

-   Lịch sử kết quả lưu trên trình duyệt.
-   Bộ lọc bài theo ngôn ngữ và chủ đề.
-   Chế độ 15/30/60 giây.
-   Hiệu ứng âm thanh bật/tắt.
-   Tùy chọn giảm chuyển động.
-   Chia sẻ thẻ kết quả dưới dạng ảnh.
-   Bảng xếp hạng theo phòng hoặc theo ngày.
-   Tối ưu giao diện mobile.
-   Chế độ chơi với bot giả lập cho người luyện tập.

### P2 --- Chỉ làm khi có người dùng thực

-   Tài khoản và đồng bộ lịch sử giữa thiết bị.
-   Hồ sơ, thành tích, streak luyện tập.
-   Phòng riêng có mật khẩu.
-   Bộ bài do cộng đồng tạo.
-   Tạo giải đấu hoặc sự kiện.
-   Gói giao diện, phương tiện trang trí.
-   Công cụ dành cho giáo viên/lớp học.
-   Hệ thống chống gian lận nâng cao.
-   Quốc tế hóa thêm ngôn ngữ.

### Không đưa vào giai đoạn đầu

-   Chat voice/video.
-   AI sinh nội dung theo yêu cầu.
-   Marketplace vật phẩm.
-   Hệ thống thanh toán.
-   Ứng dụng mobile native.

------------------------------------------------------------------------

## 5. Luồng người dùng

### Luồng A --- Luyện tập một mình

1.  Mở trang chủ.
2.  Chọn "Luyện tập".
3.  Chọn ngôn ngữ, thời gian hoặc đoạn văn.
4.  Nhấn bắt đầu.
5.  Gõ nội dung.
6.  Xem WPM, độ chính xác, ký tự đúng/sai và kết quả.
7.  Chơi lại hoặc chia sẻ kết quả.

### Luồng B --- Tạo phòng thách đấu

1.  Nhấn "Tạo phòng".
2.  Nhập nickname.
3.  Chọn icon phương tiện.
4.  Chọn màu nhận diện.
5.  Chọn chủ đề đường đua.
6.  Tạo phòng và nhận link/mã phòng.
7.  Gửi link cho bạn bè.
8.  Theo dõi người chơi tham gia.
9.  Chủ phòng chọn bài và thiết lập luật.
10. Người chơi nhấn "Sẵn sàng".
11. Khi đủ điều kiện, chủ phòng bắt đầu.
12. Tất cả nhìn thấy đếm ngược giống nhau.
13. Cuộc đua bắt đầu.
14. Kết thúc khi mọi người hoàn thành hoặc hết thời gian.
15. Xem kết quả, rematch hoặc rời phòng.

### Luồng C --- Tham gia bằng link

1.  Mở link mời.
2.  Nếu chưa có nickname trong phiên hiện tại, hiển thị màn hình setup.
3.  Chọn nickname, icon và màu.
4.  Xem phòng, chủ phòng và người chơi hiện có.
5.  Nhấn "Sẵn sàng".
6.  Chờ bắt đầu.
7.  Thi đấu và xem kết quả.

### Luồng D --- Chủ phòng chơi lại

1.  Từ màn hình kết quả, chọn "Đua lại".
2.  Giữ nguyên người chơi và cấu hình nếu phù hợp.
3.  Cho phép chủ phòng đổi đoạn văn hoặc thiết lập.
4.  Tất cả người chơi xác nhận sẵn sàng.
5.  Bắt đầu vòng mới.

------------------------------------------------------------------------

## 6. Màn hình và yêu cầu giao diện

### 6.1 Trang chủ

Nội dung: - Logo TypeRace. - CTA "Đua ngay". - CTA phụ "Luyện tập". -
Giới thiệu ngắn: tạo phòng, mời bạn, cùng đua. - Một ví dụ minh họa
đường đua. - Bộ chọn ngôn ngữ giao diện nếu có. - Footer có thông tin dự
án, quyền riêng tư và phản hồi.

Yêu cầu: - Tải nhanh, không có video nền nặng. - CTA chính nhìn thấy
ngay khi mở trang. - Không yêu cầu đăng nhập.

### 6.2 Màn hình thiết lập tay đua

Các trường: - Nickname, độ dài khuyến nghị 2--16 ký tự. - Icon phương
tiện. - Màu nhận diện. - Nút xác nhận.

Quy tắc: - Nickname không được rỗng. - Loại bỏ khoảng trắng đầu/cuối. -
Giới hạn độ dài và ký tự điều khiển. - Không cho nickname giả mạo vai
trò hệ thống. - Trùng nickname trong một phòng có thể được xử lý bằng
cách yêu cầu đổi tên hoặc tự thêm hậu tố. - Lưu nickname, phương tiện và
màu trong `localStorage` để dùng lại trên cùng trình duyệt. - Không cho
phép chọn phương tiện làm thay đổi tốc độ hoặc lợi thế thi đấu.

### 6.3 Phòng chờ

Hiển thị: - Mã phòng và nút sao chép link. - Danh sách người chơi. -
Nickname, icon, màu, trạng thái sẵn sàng. - Số người hiện tại/tối đa. -
Chủ phòng. - Cấu hình bài thi. - Nút "Sẵn sàng". - Nút "Bắt đầu" chỉ
dành cho chủ phòng. - Nút rời phòng.

Quy tắc: - MVP giới hạn 2--8 người/phòng. - Chỉ chủ phòng thay đổi cấu
hình. - Chủ phòng chỉ bắt đầu khi có tối thiểu 2 người và điều kiện sẵn
sàng được đáp ứng. - Nếu chủ phòng rời đi, chuyển quyền cho người còn
lại theo quy tắc xác định. - Phòng hết hạn sau một khoảng thời gian
không hoạt động; thời hạn cụ thể sẽ cấu hình ở backend. - Không đưa
thông tin cá nhân nhạy cảm vào link phòng.

### 6.4 Màn hình đường đua

Thành phần: - Header: mã phòng, vòng đua, trạng thái kết nối. - Khu vực
các làn đua. - Tên và icon phương tiện trên từng làn. - Vạch xuất phát
và vạch đích. - Thanh tiến độ hoặc phần trăm. - Đếm ngược 3--2--1. -
Đồng hồ đua. - Đoạn văn mục tiêu. - Vùng nhập/gõ. - WPM, độ chính xác và
tiến độ của người chơi hiện tại. - Nút thoát có xác nhận nếu đang thi.

Yêu cầu chuyển động: - Phương tiện di chuyển mượt bằng CSS transform
hoặc kỹ thuật animation phù hợp. - Tiến độ logic độc lập với animation;
animation chỉ biểu diễn trạng thái. - Không cập nhật vị trí bằng cách
thay đổi layout nặng ở mọi lần gõ. - Hỗ trợ `prefers-reduced-motion`. -
Có phương án hiển thị thanh tiến độ nếu animation không hoạt động. - Âm
thanh xuất phát, về đích có thể tắt. - Không để hiệu ứng che nội dung
gõ.

### 6.5 Màn hình kết quả

Hiển thị: - Thứ hạng. - Người thắng. - WPM. - Độ chính xác. - Thời gian
hoàn thành. - Số ký tự đúng/sai. - Biểu đồ hoặc thanh so sánh tiến độ
nếu dễ triển khai. - Nút "Đua lại". - Nút "Mời bạn". - Nút "Chia sẻ kết
quả". - Nút "Về trang chủ".

Thẻ chia sẻ cần có: - Tên người chơi. - WPM và độ chính xác. - Phương
tiện/icon. - Tên TypeRace hoặc địa chỉ website. - CTA ngắn như "Bạn có
vượt qua được không?". - Không công khai mã phòng riêng nếu chủ phòng
không muốn.

------------------------------------------------------------------------

## 7. Luật chơi và tính điểm

### 7.1 Đo lường tiến độ

Không nên dùng số phím đã nhấn làm tiến độ vì người chơi có thể gõ sai
hoặc spam phím.

Đề xuất: - So sánh nội dung người dùng nhập với văn bản mục tiêu. - Tính
số ký tự đúng theo vị trí. - Tính số từ hoàn thành đúng. - Dùng một công
thức tiến độ thống nhất cho mọi người. - Phần trăm tiến độ không vượt
quá 100%. - Người chơi chỉ về đích khi hoàn thành toàn bộ nội dung theo
luật đã công bố.

Công thức tiến độ MVP:
`progress = correctCompletedCharacters / totalTargetCharacters`

Có thể chuyển sang tiến độ theo từ hoàn thành đúng nếu thử nghiệm cho
thấy công thức theo ký tự khiến xe nhấp nháy hoặc cảm giác không tự
nhiên. Phải dùng cùng một công thức trong cả phòng.

### 7.2 WPM

Cần ghi rõ cách tính. Công thức phổ biến là:
`WPM = (số ký tự hợp lệ / 5) / thời gian tính bằng phút`

Lưu ý: - Với bài cố định, dùng thời gian từ lúc bắt đầu đến lúc hoàn
thành. - Với bài theo thời gian, tính theo thời gian thực đã trôi qua. -
Nên hiển thị cả độ chính xác để WPM không bị hiểu nhầm. - Định nghĩa "ký
tự hợp lệ" phải nhất quán. - Không so sánh trực tiếp WPM tiếng Việt với
tiếng Anh như hai thang đo hoàn toàn tương đương.

### 7.3 Độ chính xác

Cần thống nhất mẫu số. Gợi ý cho MVP:
`accuracy = correctTypedCharacters / totalTypedCharacters * 100`

Xử lý: - Nếu chưa gõ gì, hiển thị `—` thay vì chia cho 0. - Khi người
dùng sửa lỗi, tính lại theo nội dung hiện tại hoặc theo số lần gõ; chọn
một quy tắc rõ ràng. - Không để người dùng đạt 100% bằng cách bỏ qua ký
tự sai nếu luật yêu cầu nhập đúng toàn bộ.

### 7.4 Thứ hạng

Thứ hạng chính: 1. Người hoàn thành nội dung hợp lệ trước. 2. Nếu cùng
thời điểm theo độ chính xác của timestamp hệ thống, dùng thời gian hoàn
thành do máy chủ ghi nhận. 3. Nếu không ai hoàn thành trong bài theo
thời gian, xếp theo tiến độ hợp lệ; dùng WPM và độ chính xác làm tiêu
chí phụ theo quy tắc đã công bố.

Không nên chỉ xếp hạng theo WPM vì cuộc đua trực quan cần gắn với tiến
độ hoàn thành.

### 7.5 Trạng thái cuộc đua

-   `waiting`: phòng chờ.
-   `countdown`: đếm ngược.
-   `running`: đang đua.
-   `finished`: cuộc đua kết thúc.
-   `cancelled`: cuộc đua bị hủy.
-   `disconnected`: người chơi mất kết nối (trạng thái người chơi, không
    nhất thiết hủy cả phòng).

------------------------------------------------------------------------

## 8. Xử lý tiếng Việt và bộ gõ

Đây là một hạng mục cần kiểm thử kỹ. Người dùng Việt Nam có thể dùng
Telex hoặc VNI; khi gõ dấu, chuỗi ký tự có thể tạm thời chưa ở trạng
thái cuối cùng.

Yêu cầu: - Dùng sự kiện `compositionstart`, `compositionupdate`,
`compositionend` và kiểm tra `event.isComposing` khi xử lý input. -
Không đánh dấu sai trong lúc IME đang ghép ký tự. - Không tự động sửa
văn bản đầu vào. - Chuẩn hóa Unicode nhất quán khi so sánh, cân nhắc
NFC. - Kiểm tra gõ dấu bằng UniKey/EVKey trên Windows và bộ gõ mặc định
trên macOS nếu có thiết bị thử. - Kiểm tra Backspace, Ctrl+A, dán văn
bản, phím mũi tên và chuyển focus. - Chọn chính sách paste rõ ràng: cho
phép hoặc chặn dán; trong game thi đấu nên cân nhắc chặn paste ở vùng
nhập, nhưng không được ảnh hưởng quyền truy cập và khả năng sử dụng cơ
bản. - Không được coi `keydown` là nguồn duy nhất của ký tự đã nhập; ưu
tiên giá trị input/textarea sau khi trình duyệt xử lý IME.

### Kiểm thử bắt buộc

-   Gõ tiếng Anh.
-   Gõ tiếng Việt có dấu.
-   Gõ Telex với dấu mũ, dấu móc, dấu thanh.
-   Gõ VNI.
-   Xóa và gõ lại từ.
-   Chuyển giữa tab/window khi đang thi.
-   Dán văn bản nếu chế độ cho phép.
-   Gõ liên tục tốc độ cao.

------------------------------------------------------------------------

## 9. Kiến trúc công nghệ đề xuất

### 9.1 Frontend

-   React.
-   Vite.
-   TypeScript.
-   CSS Modules hoặc Tailwind CSS; chọn một cách chính để tránh trộn
    nhiều hệ thống.
-   React Router nếu có nhiều trang.
-   Zustand hoặc React Context cho state phía client; chỉ thêm thư viện
    khi thực sự cần.
-   Web Font có giấy phép rõ ràng hoặc font hệ thống để giảm tải.
-   Kiểm thử logic bằng Vitest; kiểm thử luồng trình duyệt bằng
    Playwright khi dự án ổn định.

### 9.2 Backend và realtime

**Lựa chọn chính thức:** **Firebase Realtime Database** (gói Spark miễn phí).

-   **Project ID:** `type-race-2210`
-   **Cấu hình dự án:** Đã được tích hợp trực tiếp vào mã nguồn hệ thống (`src/services/firebase.ts`), ẩn toàn bộ cấu hình thủ công khỏi giao diện người dùng.
-   **Phân quyền người dùng (Role-based Access):**
    -   **Quản Trị Viên (Admin):** Tài khoản admin cố định (`admin` / `admin123`), có quyền truy cập Bảng Quản Trị Hệ Thống (`AdminDashboardModal`), quản lý/thêm/xóa kho bài gõ, theo dõi hạ tầng Firebase.
    -   **Người Chơi (User):** Có thể chơi với tư cách Khách (Guest) hoặc đăng ký tài khoản thành viên để lưu lịch sử thành tích, tạo phòng và tham gia đua.
-   **Quy tắc & Giới hạn:** Cần cấu hình Firebase Security Rules để chỉ cho phép người chơi cập nhật dữ liệu của chính mình trong phòng; theo dõi quota Spark (100 kết nối đồng thời, 1GB lưu trữ, 10GB tải/tháng).
-   **Tối ưu quota:** Throttle cập nhật tiến độ (300ms/lần) và tự động dọn phòng hết hạn.
-   **Hosting frontend:** Firebase Hosting hoặc Cloudflare Pages.

### 9.3 Không cần backend cho

-   Luyện tập một người.
-   Tính WPM cục bộ.
-   Chọn phương tiện.
-   Preview giao diện.
-   Lịch sử cá nhân đơn giản trong localStorage.

### 9.4 Hosting

-   Frontend static có thể triển khai trên nền tảng hosting miễn phí phù
    hợp.
-   Không commit secret hoặc admin key vào frontend.
-   Tách biến môi trường development và production.
-   Thiết lập custom domain sau khi MVP có tín hiệu người dùng; không
    cần mua domain ngay.

------------------------------------------------------------------------

## 10. Thiết kế dữ liệu

Mô hình dữ liệu dạng cây JSON được tổ chức trực tiếp trên Firebase
Realtime Database.

### Room

-   `roomId`: mã phòng ngắn, không tuần tự dễ đoán.
-   `hostPlayerId`: ID phiên của chủ phòng.
-   `status`: waiting/countdown/running/finished/cancelled.
-   `createdAt`: thời gian tạo.
-   `lastActivityAt`: hoạt động gần nhất.
-   `settings`: cấu hình bài thi.
-   `raceId`: ID vòng đua hiện tại.
-   `maxPlayers`: mặc định 8.
-   `version`: phiên bản trạng thái để tránh cập nhật cũ ghi đè trạng
    thái mới.

### Player

-   `playerId`: ID ngẫu nhiên theo phiên.
-   `displayName`: nickname.
-   `vehicleId`: loại phương tiện.
-   `colorId`: màu nhận diện.
-   `isReady`: trạng thái sẵn sàng.
-   `isConnected`: trạng thái kết nối gần đúng.
-   `progress`: tiến độ.
-   `wpm`: tốc độ gõ hiện tại.
-   `accuracy`: độ chính xác.
-   `finishTime`: thời gian hoàn thành, nếu có.
-   `lastSeenAt`: lần hoạt động cuối.

Không lưu dữ liệu cá nhân nhạy cảm; nickname không cần là tên thật.

### Race

-   `raceId`.
-   `roomId`.
-   `status`.
-   `textId` hoặc `textSnapshot`.
-   `language`.
-   `trackTheme`.
-   `mode`: fixed_text hoặc timed.
-   `durationSeconds` nếu là bài theo thời gian.
-   `startAt`: thời điểm bắt đầu chuẩn theo máy chủ.
-   `endAt`.
-   `results`.
-   `createdAt`.

### Result

-   `playerId`.
-   `displayNameSnapshot`.
-   `vehicleIdSnapshot`.
-   `wpm`.
-   `accuracy`.
-   `correctCharacters`.
-   `incorrectCharacters`.
-   `progress`.
-   `finishTime`.
-   `rank`.

### Nguyên tắc dữ liệu

-   Dùng ID ổn định, không dùng nickname làm khóa chính.
-   Giới hạn kích thước payload và độ dài nickname.
-   Không cho client tự sửa kết quả cuối cùng của người khác.
-   Dọn dữ liệu phòng cũ để tránh tốn quota.
-   Không lưu lịch sử vĩnh viễn trong MVP nếu chưa có nhu cầu.

------------------------------------------------------------------------

## 11. Đồng bộ realtime và công bằng

### 11.1 Bắt đầu cuộc đua

-   Chủ phòng gửi yêu cầu bắt đầu.
-   Backend kiểm tra chủ phòng, trạng thái phòng, số người chơi và điều
    kiện sẵn sàng.
-   Backend ghi `startAt` ở tương lai một khoảng ngắn để client có thời
    gian nhận thông báo.
-   Client tính thời gian còn lại từ `startAt` thay vì tự bắt đầu đồng
    hồ ngay khi nhận event.
-   Mọi client dùng cùng timestamp chuẩn; animation cục bộ chỉ dựa trên
    tiến độ.

### 11.2 Cập nhật tiến độ

-   Client gửi tiến độ định kỳ hoặc khi thay đổi đáng kể, không gửi toàn
    bộ nội dung từng phím nếu không cần.
-   Giới hạn tần suất cập nhật để tiết kiệm quota.
-   Gửi các trường tối thiểu: playerId, progress, WPM ước tính, accuracy
    ước tính, timestamp.
-   Backend xác thực người gửi có thuộc phòng.
-   Client không được phép cập nhật tiến độ của người khác.
-   Khi cuộc đua kết thúc, đóng nhận cập nhật hoặc bỏ qua sự kiện cũ.

### 11.3 Mất kết nối

-   Hiển thị biểu tượng kết nối yếu hoặc mất kết nối.
-   Giữ trạng thái gần nhất trong thời gian chờ reconnect.
-   Khi reconnect, đồng bộ trạng thái phòng hiện tại.
-   Nếu người chơi đã hoàn thành, không cho sự kiện cũ làm lùi trạng
    thái.
-   Nếu chủ phòng mất kết nối, áp dụng quy tắc chuyển quyền hoặc chờ
    reconnect.
-   Không hủy cuộc đua chỉ vì một người rời phòng, trừ khi chủ phòng hủy
    hoặc không còn người chơi hợp lệ.

### 11.4 Giới hạn chống gian lận cho MVP

-   Không thể chống gian lận tuyệt đối trong bản đầu.
-   Không tin dữ liệu từ client một cách vô điều kiện.
-   Xác thực quyền thay đổi cấu hình và trạng thái phòng.
-   Kiểm tra phạm vi giá trị và tần suất gửi.
-   Có thể kiểm tra tính hợp lý của tốc độ và thời gian hoàn thành.
-   Không công bố xếp hạng toàn cầu có giá trị cao cho tới khi có cơ chế
    xác minh tốt hơn.

------------------------------------------------------------------------

## 12. Hiệu ứng và tài nguyên hình ảnh

### Phương tiện

Bản đầu dùng emoji để kiểm chứng ý tưởng nhanh: - Xe đua. - Ô tô. - Mô
tô. - Tên lửa. - Thuyền. - UFO. - Tàu. - Rùa.

Ưu điểm: nhanh, miễn phí, không cần tự vẽ asset. Nhược điểm: emoji khác
nhau giữa hệ điều hành và font, kích thước/đường nét không đồng nhất.

Sau MVP, nếu cần nhận diện thương hiệu: - Thay emoji bằng SVG hoặc
sprite do dự án tự tạo. - Dùng chung kích thước khung hình. - Mỗi phương
tiện chỉ mang tính trang trí, không có chỉ số riêng. - Kiểm tra giấy
phép của mọi asset bên ngoài.

### Chủ đề đường đua

P0: - Một chủ đề đường đua truyền thống.

P1: - Đại dương. - Không gian.

Mỗi chủ đề chỉ đổi nền, vạch đường và hiệu ứng nhỏ; không thay đổi luật
di chuyển.

### Hiệu ứng nên có

-   Đếm ngược 3--2--1.
-   Vạch xuất phát/vạch đích.
-   Phương tiện tăng tốc nhẹ khi đang gõ.
-   Hiệu ứng về đích.
-   Confetti hoặc hiệu ứng thắng nhẹ.
-   Âm thanh có nút bật/tắt.
-   Tùy chọn giảm chuyển động.

### Tránh

-   Particle/animation quá nặng.
-   Âm thanh tự phát khi người dùng chưa tương tác.
-   Flash nhấp nháy liên tục.
-   Hiệu ứng gây khó đọc đoạn văn.

------------------------------------------------------------------------

## 13. Thiết kế giao diện và phong cách

### Định hướng

-   Giao diện hiện đại, tối giản, cảm giác game.
-   Đường đua là khu vực trực quan quan trọng nhất.
-   Đoạn văn phải dễ đọc, tương phản tốt.
-   Nickname, icon và màu nhận diện không bị lẫn nhau.
-   Responsive nhưng ưu tiên desktop ở MVP vì gõ phím vật lý là trải
    nghiệm chính.

### Hệ thống màu gợi ý

-   Nền tối xanh navy hoặc nền sáng trung tính.
-   Một màu nhấn cho CTA.
-   Mỗi tay đua có màu phân biệt nhưng vẫn đáp ứng độ tương phản.
-   Tránh dùng màu duy nhất để truyền thông tin; kèm nickname/icon.

### Responsive

Desktop: - Đường đua nằm trên, đoạn văn và vùng gõ bên dưới. - Có thể
hiển thị 4--8 làn mà không quá chật.

Mobile: - Thu gọn header và panel thông tin. - Không buộc người dùng xem
đường đua quá nhỏ. - Dùng layout dạng danh sách/tiến độ khi màn hình
hẹp. - Kiểm tra bàn phím ảo có che vùng gõ và kết quả không.

------------------------------------------------------------------------

## 14. Cấu trúc mã nguồn dự kiến

Ví dụ cấu trúc frontend:

``` text
typerace/
├─ public/
│  ├─ favicon.svg
│  └─ assets/
├─ src/
│  ├─ app/
│  │  ├─ App.tsx
│  │  └─ routes.tsx
│  ├─ components/
│  │  ├─ Button.tsx
│  │  ├─ Modal.tsx
│  │  ├─ PlayerAvatar.tsx
│  │  └─ CopyLinkButton.tsx
│  ├─ features/
│  │  ├─ home/
│  │  ├─ setup/
│  │  ├─ practice/
│  │  ├─ room/
│  │  ├─ race/
│  │  └─ results/
│  ├─ game/
│  │  ├─ scoring.ts
│  │  ├─ textInput.ts
│  │  ├─ raceState.ts
│  │  └─ raceTypes.ts
│  ├─ services/
│  │  ├─ roomService.ts
│  │  ├─ raceService.ts
│  │  └─ storageService.ts
│  ├─ hooks/
│  ├─ styles/
│  ├─ data/
│  │  └─ typingTexts.ts
│  └─ main.tsx
├─ tests/
├─ .env.example
├─ package.json
├─ tsconfig.json
└─ README.md
```

Nguyên tắc: - Logic tính điểm nằm riêng, không nhúng trực tiếp trong
component giao diện. - Dùng interface/type rõ ràng cho Room, Player,
Race và Result. - Tách adapter backend (RoomService, RaceService) khỏi logic game
để dễ bảo trì hoặc nâng cấp sau này. - Không đặt secret trong mã frontend. - Tránh chia
nhỏ quá mức trước khi logic đã ổn định.

------------------------------------------------------------------------

## 15. Lộ trình triển khai chi tiết

Lịch dưới đây là ước lượng cho một người phát triển, có thể thay đổi
theo kinh nghiệm và số giờ làm mỗi ngày.

### Giai đoạn 0 --- Chốt yêu cầu (0,5--1 ngày)

-   [x] Chốt tên TypeRace và phong cách giao diện.
-   [x] Chốt MVP: luyện tập + phòng realtime + đường đua + kết quả.
-   [x] Chốt giới hạn 2--8 người/phòng.
-   [x] Chốt luật chơi và cách tính điểm.
-   [x] Chốt backend realtime: Chọn Firebase Realtime Database.
-   [x] Thiết kế hệ thống component và styling Cyberpunk / Neon.
-   [x] Tạo cấu trúc mã nguồn.

**Đầu ra:** tài liệu yêu cầu, cấu trúc dự án.

### Giai đoạn 1 --- Khởi tạo dự án (0,5 ngày)

-   [x] Tạo React + Vite + TypeScript.
-   [x] Cấu hình font Google (Outfit & JetBrains Mono) và build bundle.
-   [x] Tạo routing và trạng thái màn hình (home, practice, room).
-   [x] Tạo design tokens: màu neon, glassmorphism, glowing borders.
-   [x] Tạo component Header, Button, Input, Modal, StatsBadge.
-   [x] Tích hợp synthesizer Web Audio cho âm thanh tự động 0MB.

**Đầu ra:** ứng dụng chạy local tại http://localhost:5173, cấu trúc ổn định.

### Giai đoạn 2 --- Trang chủ và setup tay đua (1 ngày)

-   [x] Thiết kế trang chủ hiện đại với hero banner và action cards.
-   [x] Form nickname có kiểm tra 2--16 ký tự và nút đổi tên ngẫu nhiên.
-   [x] Bộ chọn 8 phương tiện (F1, siêu xe, mô tô, tên lửa, UFO, cano, rùa, ván trượt).
-   [x] Bộ chọn 6 màu nhận diện neon có glow.
-   [x] Lưu cấu hình cục bộ qua `localStorage`.
-   [x] Xem trước tay đua thời gian thực trong modal.
-   [x] Responsive đầy đủ trên mobile và desktop.

**Đầu ra:** người dùng có thể thiết lập tay đua và lưu trạng thái.

### Giai đoạn 3 --- Engine gõ và tính điểm (1--2 ngày)

-   [x] Tạo thư viện đoạn văn mẫu tiếng Việt & tiếng Anh (Dễ, Vừa, Khó).
-   [x] Xử lý nhập văn bản mượt mà, phân loại ký tự đúng, ký tự sai, con trỏ.
-   [x] Xử lý chuẩn hóa Unicode NFC và IME tiếng Việt (Telex, VNI).
-   [x] Tính toán công thức WPM chuẩn quốc tế: (chars / 5) / phút.
-   [x] Tính độ chính xác accuracy (%).
-   [x] Tính tiến độ progress (%) từ 0 đến 100%.
-   [x] Đồng hồ đếm ngược và kết thúc chặng đua.
-   [x] Màn hình kết quả có hiệu ứng ăn mừng Confetti.

**Đầu ra:** chế độ luyện tập một người chạy hoàn chỉnh.

### Giai đoạn 4 --- Đường đua và animation (1--2 ngày)

-   [x] Tạo thành phần RaceTrack với các làn đua riêng biệt.
-   [x] Hiển thị tên, icon xe, màu nhận diện, vạch xuất phát và vạch đích ca-rô.
-   [x] Liên kết tiến độ với vị trí xe chạy mượt qua CSS transitions.
-   [x] Đếm ngược 3--2--1--GO với hiệu ứng chữ phóng to và âm thanh beep.
-   [x] Hiệu ứng khói/lửa tăng tốc sau đuôi xe khi đang gõ.
-   [x] Tùy chọn bật/tắt âm thanh (lưu trạng thái).
-   [x] Hỗ trợ `prefers-reduced-motion` cho trợ năng.
-   [x] Kiểm tra hiển thị nhiều tay đua cùng lúc trên đường đua.

**Đầu ra:** đường đua hoạt động sống động với xe của người chơi và đối thủ.

### Giai đoạn 5 --- Phòng realtime (2--4 ngày)

-   [x] Tích hợp adapter Firebase Realtime Database.
-   [x] Tích hợp fallback Local Multi-Tab Bus (BroadcastChannel + localStorage) giúp mở 2 tab đua nhau ngay lập tức mà không cần cấu hình trước.
-   [x] Modal cấu hình Firebase cho phép dán config JSON từ Firebase Console.
-   [x] Sinh mã phòng ngẫu nhiên 6 ký tự không trùng lặp (VD: RACE77).
-   [x] Tham gia phòng bằng mã hoặc link mời có chứa query parameter `?room=CODE`.
-   [x] Đồng bộ danh sách người chơi, trạng thái sẵn sàng, host crown.
-   [x] Chức năng "Thêm Bot Đua" cho phép chủ phòng thêm bot AI vào phòng bất cứ lúc nào.
-   [x] Đồng bộ thời điểm bắt đầu `startAt` đảm bảo tính công bằng.
-   [x] Throttle tiến độ (300ms) để tiết kiệm quota kết nối.
-   [x] Xử lý rời phòng và tự động chuyển quyền chủ phòng.

**Đầu ra:** người chơi có thể tạo phòng và đua realtime giữa các tab hoặc qua mạng Internet.

### Giai đoạn 6 --- Kết quả và vòng lặp chia sẻ (1 ngày)

-   [x] Bảng xếp hạng thứ hạng (#1 Quán quân, #2, #3...).
-   [x] So sánh chi tiết WPM, độ chính xác và thời gian về đích giữa các tay đua.
-   [x] Nút "Đua Lại" (Rematch) cho phép chủ phòng đổi bài mới và giữ nguyên phòng.
-   [x] Nút "Sao Chép Link Mời" và "Chia Sẻ Thẻ Kết Quả" tự tạo text khoe thành tích.
-   [x] Lưu lịch sử và thành tích cá nhân (kỷ lục WPM, tổng số từ, danh hiệu tốc độ).

**Đầu ra:** vòng lặp game khép kín, sẵn sàng trải nghiệm và chia sẻ.

### Giai đoạn 7 --- Kiểm thử và sửa lỗi (1--2 ngày)

-   [ ] Test trên Chrome và Edge.
-   [ ] Test 2--8 người.
-   [ ] Test nickname trùng.
-   [ ] Test phòng đầy.
-   [ ] Test chủ phòng rời.
-   [ ] Test reconnect.
-   [ ] Test refresh trang.
-   [ ] Test link phòng hết hạn.
-   [ ] Test gõ tiếng Việt bằng Telex/VNI.
-   [ ] Test paste, Backspace và sửa lỗi.
-   [ ] Test mạng chậm.
-   [ ] Test màn hình nhỏ.
-   [ ] Test hiệu năng khi nhiều sự kiện gõ liên tục.
-   [ ] Test quyền truy cập backend.
-   [ ] Kiểm tra lỗi console và log.

**Đầu ra:** bản beta có thể gửi cho nhóm bạn dùng thử.

### Giai đoạn 8 --- Triển khai và thử nghiệm (0,5--1 ngày)

-   [ ] Tạo production build.
-   [ ] Cấu hình environment variables.
-   [ ] Deploy frontend.
-   [ ] Kiểm tra URL HTTPS.
-   [ ] Kiểm tra cấu hình backend production.
-   [ ] Viết hướng dẫn sử dụng ngắn.
-   [ ] Gửi link cho 10--20 người thử nghiệm đầu tiên.
-   [ ] Thu phản hồi và lỗi.
-   [ ] Ưu tiên sửa lỗi ảnh hưởng việc vào phòng/đua trước khi thêm tính
    năng mới.

**Đầu ra:** URL beta có thể chia sẻ.

### Tổng thời gian ước lượng

Khoảng 8--14 ngày làm việc nếu làm một mình và không gặp vấn đề lớn với
backend. Đây là khoảng dự kiến, không phải cam kết. Nếu làm realtime
ngay từ đầu, phần đồng bộ và kiểm thử thường là phần tốn công nhất.

------------------------------------------------------------------------

## 16. Chiến lược phát hành và thu hút người dùng

### Trước khi public

-   Cho 5--10 người quen thử.
-   Quan sát xem họ có tự hiểu cách tạo phòng không.
-   Kiểm tra họ có tự gửi link mời không.
-   Hỏi điểm nào vui nhất và điểm nào gây khó chịu.
-   Không chỉ hỏi "bạn có thích không"; quan sát hành vi thực tế.

### Ra mắt thử nghiệm

-   Đăng video ngắn cho thấy xe chạy theo tốc độ gõ.
-   Làm nội dung kiểu "Ai trong nhóm gõ nhanh nhất?".
-   Tạo thử thách với các đoạn văn hài hước hoặc chủ đề đang được quan
    tâm.
-   Chia sẻ vào cộng đồng phù hợp, không spam.
-   Nhờ người thử gửi link cho một người khác.
-   Thử cả tiếng Việt lẫn tiếng Anh để đo nhóm nào phản hồi tốt hơn.

### Vòng lặp tăng trưởng

1.  Người A tạo phòng.
2.  A gửi link cho B/C/D.
3.  B/C/D vào chơi không cần tài khoản.
4.  Kết quả tạo động lực đua lại.
5.  Một người trong nhóm tạo phòng mới.
6.  Những người nhận link trở thành người tạo phòng tiếp theo.

### Chỉ số thử nghiệm ban đầu

Đây là chỉ số nội bộ để tham khảo, không phải chuẩn ngành: - Người tạo
phòng có mời được ít nhất một người không? - Người nhận link có hoàn
thành một lượt đua không? - Tỷ lệ phòng có từ 2 người trở lên. - Tỷ lệ
đua lại. - Tỷ lệ người dùng quay lại trong 7 ngày. - Thời gian từ mở
link đến bắt đầu lượt đua.

Nếu nhiều người vào trang nhưng ít người hoàn thành lượt đua, ưu tiên
cải thiện onboarding và cảm giác gõ. Nếu người chơi hoàn thành nhưng
không mời ai, cần cải thiện thẻ kết quả và trải nghiệm rematch.

------------------------------------------------------------------------

## 17. Kiếm tiền về sau

Không đưa quảng cáo hoặc paywall vào MVP. Trước hết cần xác nhận có
người dùng quay lại.

### Mô hình có thể thử

1.  **Giao diện trang trí:** chủ đề đường đua, skin phương tiện, hiệu
    ứng về đích.
2.  **Gói cá nhân:** thống kê lịch sử nâng cao, mục tiêu luyện tập.
3.  **Gói giáo viên/lớp học:** tạo phòng lớp, bộ bài riêng, bảng kết
    quả.
4.  **Giải đấu/sự kiện:** phòng thi có cấu hình riêng.
5.  **Tài trợ phù hợp:** chỉ khi lượng người dùng và nội dung đủ phù
    hợp.

### Nguyên tắc

-   Không bán lợi thế tốc độ.
-   Không bắt buộc trả tiền để tham gia đua cơ bản.
-   Không làm trải nghiệm khó chịu bằng quảng cáo quá sớm.
-   Chỉ phát triển tính năng trả phí khi có nhu cầu thực tế được xác
    nhận.

------------------------------------------------------------------------

## 18. Chi phí dự kiến

### Khi phát triển

-   React/Vite/TypeScript: miễn phí.
-   Git: có thể dùng gói miễn phí.
-   IDE: có thể dùng VS Code miễn phí.
-   Thiết kế: có thể dùng công cụ miễn phí.
-   Font và asset: ưu tiên hệ thống hoặc tài nguyên có giấy phép phù
    hợp.
-   Hosting frontend: chọn gói miễn phí phù hợp.
-   Backend realtime: chọn một free tier, kiểm tra giới hạn và quy định
    hiện hành.
-   Domain: có thể trì hoãn, dùng URL hosting trước.

### Rủi ro chi phí

-   Lượng kết nối realtime cao.
-   Số lần đọc/ghi database tăng do cập nhật tiến độ quá thường xuyên.
-   Băng thông hoặc giới hạn hosting.
-   Dịch vụ free tier thay đổi.
-   Cần domain riêng khi sản phẩm bắt đầu phát triển.

### Cách kiểm soát

-   Cập nhật tiến độ theo nhịp hợp lý, không ghi database mỗi phím.
-   Chỉ gửi dữ liệu cần thiết.
-   Dọn phòng cũ.
-   Theo dõi quota.
-   Đặt cảnh báo ngân sách nếu nhà cung cấp hỗ trợ.
-   Không để secret hoặc quyền admin trong client.
-   Trước khi công khai, kiểm tra kỹ security rules và giới hạn dịch vụ.

------------------------------------------------------------------------

## 19. Rủi ro và cách giảm thiểu

  -----------------------------------------------------------------------
  Rủi ro                  Tác động                Giảm thiểu
  ----------------------- ----------------------- -----------------------
  Đồng bộ bắt đầu không   Cuộc đua thiếu công     Dùng timestamp bắt đầu
  cùng lúc                bằng                    do backend quản lý

  IME tiếng Việt bị báo   Người dùng khó chịu     Xử lý composition
  sai                                             events và test thực tế

  Spam sự kiện gây tốn    Tăng chi phí/giật lag   Giới hạn tần suất cập
  quota                                           nhật

  Người chơi refresh bị   Rời cuộc đua            Lưu session ID và hỗ
  mất phiên                                       trợ reconnect

  Chủ phòng rời đi        Phòng bị kẹt            Quy tắc chuyển chủ
                                                  phòng

  Nickname không phù hợp  Trải nghiệm xấu         Giới hạn độ dài, lọc ký
                                                  tự điều khiển, cơ chế
                                                  báo cáo nếu cần

  Emoji khác nhau giữa    UI thiếu đồng nhất      Chấp nhận ở MVP, thay
  thiết bị                                        bằng SVG sau

  Thiếu người để đấu      Không có đối thủ        Chế độ luyện tập và bot
                                                  giả lập đơn giản

  Có đối thủ đã lớn       Khó thu hút             Tập trung vào tạo phòng
                                                  nhanh, vui, tiếng Việt
                                                  và chia sẻ

  Spam hoặc bot           Phòng bị phá            Giới hạn tạo phòng,
                                                  join, tần suất cập nhật

  Dịch vụ miễn phí đổi    Phát sinh chi phí       Tách backend adapter,
  chính sách                                      theo dõi quota và có
                                                  phương án chuyển đổi
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 20. Danh sách kiểm thử nghiệm thu

### Setup

-   [ ] Không nhập nickname thì không tiếp tục.
-   [ ] Nickname quá dài được xử lý.
-   [ ] Chọn phương tiện và màu cập nhật preview.
-   [ ] Reload trang vẫn có thể khôi phục tùy chọn cục bộ.

### Phòng

-   [ ] Tạo phòng thành công.
-   [ ] Link/mã phòng hợp lệ.
-   [ ] Mã sai hoặc phòng hết hạn có thông báo rõ.
-   [ ] Không vượt quá số người tối đa.
-   [ ] Người chơi không thể đổi cấu hình nếu không phải chủ phòng.
-   [ ] Chủ phòng rời phòng được xử lý.

### Đua

-   [ ] Mọi người dùng cùng nội dung.
-   [ ] Đếm ngược đồng bộ.
-   [ ] Xe di chuyển theo tiến độ đúng.
-   [ ] Không thể có tiến độ âm hoặc vượt 100%.
-   [ ] Kết thúc đúng điều kiện.
-   [ ] Người hoàn thành sớm được ghi nhận.
-   [ ] Người mất kết nối không làm hỏng cuộc đua của người khác.

### Tính điểm

-   [ ] WPM đúng với thời gian đo.
-   [ ] Độ chính xác không chia cho 0.
-   [ ] Sửa lỗi cập nhật số liệu theo quy tắc.
-   [ ] Tiến độ phù hợp với văn bản mục tiêu.
-   [ ] Xếp hạng theo luật đã công bố.

### Tiếng Việt

-   [ ] Telex.
-   [ ] VNI.
-   [ ] Ký tự có dấu.
-   [ ] Unicode normalization.
-   [ ] Backspace và sửa từ.
-   [ ] IME composition không bị báo lỗi giả.

### Kết quả/chia sẻ

-   [ ] Hiện đủ thông số.
-   [ ] Đua lại hoạt động.
-   [ ] Copy link hoạt động hoặc có fallback.
-   [ ] Chia sẻ không được hỗ trợ vẫn có thể sao chép URL.
-   [ ] Không lộ dữ liệu riêng tư ngoài ý muốn.

### Hiệu năng và bảo mật

-   [ ] Không có lỗi console nghiêm trọng.
-   [ ] Giao diện không giật mạnh khi gõ nhanh.
-   [ ] Backend kiểm tra quyền truy cập.
-   [ ] Client không sửa được kết quả của người khác.
-   [ ] Giới hạn payload và tần suất cập nhật.
-   [ ] Phòng cũ được dọn dẹp.
-   [ ] Kiểm tra quy tắc bảo mật trước khi public.

------------------------------------------------------------------------

## 21. Backlog ưu tiên

### Làm ngay

1.  Chốt UI và luật chơi.
2.  Khởi tạo project.
3.  Làm engine gõ cục bộ.
4.  Làm đường đua với dữ liệu giả.
5.  Làm kết quả.
6.  Tích hợp Firebase Realtime Database.
7.  Làm phòng.
8.  Làm share/rematch.
9.  Test IME và reconnect.
10. Deploy beta.

### Chỉ làm sau khi MVP ổn định

-   Nhiều chủ đề đường đua.
-   Thêm hàng chục phương tiện.
-   Tài khoản.
-   Hồ sơ cá nhân.
-   Bảng xếp hạng toàn cầu.
-   Cửa hàng skin.
-   Thành tích và streak.
-   Chat.
-   Tính năng AI.

------------------------------------------------------------------------

## 22. Quyết định cần chốt trước khi code

Các mặc định đề xuất: - Frontend: React + Vite + TypeScript. - Phòng:
2--8 người. - Người dùng: không cần tài khoản. - Ngôn ngữ ban đầu: tiếng
Việt và tiếng Anh. - Phương tiện: emoji trước, SVG sau. - Chủ đề đầu
tiên: đường đua truyền thống. - Chế độ đua đầu tiên: đoạn văn cố định. -
Backend realtime: Đã chốt Firebase Realtime Database (không dùng Supabase
trong MVP để tối ưu tốc độ và đơn giản hóa dữ liệu phòng). - Hosting: gói miễn phí phù hợp. - Ưu tiên
desktop, responsive cho mobile. - Không tích hợp thanh toán hoặc quảng
cáo trong MVP.

Trước khi bắt đầu giai đoạn realtime, cần thử nghiệm một spike nhỏ: tạo
phòng, hai trình duyệt cùng thấy nhau, cùng nhận `startAt`, và cập nhật
tiến độ. Nếu spike hoạt động ổn định thì mới mở rộng sang toàn bộ UI
phòng.

------------------------------------------------------------------------

## 23. Định nghĩa hoàn thành (Definition of Done)

Một tính năng chỉ được coi là hoàn thành khi: - Có trạng thái loading,
success và error phù hợp. - Có kiểm tra đầu vào. - Không làm hỏng luồng
hiện tại. - Được thử trên ít nhất hai trình duyệt khi liên quan đến
realtime. - Có xử lý trường hợp mất kết nối hoặc dữ liệu không hợp lệ
nếu cần. - Không đưa secret vào frontend. - Code dễ hiểu và có thể sửa
đổi. - Có ghi chú trong README nếu cần cấu hình. - Được kiểm tra lại
trên production sau khi deploy.

------------------------------------------------------------------------

## 24. Kết luận

TypeRace nên bắt đầu như một game nhỏ có vòng lặp rõ ràng:

**Tạo phòng → chọn tay đua → mời bạn → đếm ngược → đua gõ phím → xem kết
quả → đua lại.**

Đừng cố xây một nền tảng luyện gõ toàn diện ngay từ đầu. Điểm khác biệt
của sản phẩm là cảm giác đua trực quan và khả năng mời bạn vào chơi
nhanh. Khi vòng lặp này thực sự vui và ổn định, mới đầu tư vào nhiều chủ
đề, thành tích, tài khoản và kiếm tiền.

**Bước tiếp theo:** dựng wireframe và hoàn thiện chế độ luyện tập cục bộ
trước; sau đó làm đường đua với dữ liệu giả, rồi mới tích hợp realtime.
Cách này giúp phát hiện vấn đề về trải nghiệm và luật chơi trước khi
phải xử lý độ phức tạp của backend.
