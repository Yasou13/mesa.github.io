## Arama sonucunda neler korunur?

Asıl bilgi kaydı; özne, ilişki ve nesneyi dayanak metinle birleştirir. Belge, sürüm, metin parçası, değişiklik işlemi ve işleme hattının kimlikleri bu bağın izlenmesini sağlar. Çizge aramasında da yolu destekleyen bilgi kayıtları, düğümler ve bağlantı yönleri korunur. Bulunan bir yol, onu destekleyen kaynaklardan ayrı sunulmamalıdır.

## Üç içerik özeti aynı şeyi göstermez

Belge sürümünün tamamına ait içerik özeti, sürümdeki parçaları listeleyen sabitlenmiş bildirimin özeti ve tek parçanın içerik özeti farklıdır. Tek bir parça eklemek, bütün sürüm için içerik özeti oluşturmaz. Hukuki kimlik alanları yapısal bağlantıyı ve sınırlı ad eşleştirmesini denetler; kaynağın yorumlanması yine veriyi sağlayan sistemin sorumluluğundadır.

## Kanıt bağlam bütçesine tam olarak sığmalı

ContextBuilder, HTTP yanıtının tamamını değil modelin göreceği biçimlendirilmiş kanıtı sayar. Bir çizge yolunun kanıtı bütçeye bütün olarak sığmalıdır. Asıl BPE sayacı yüklenemezse UTF-8 baytlarına dayanan temkinli bir üst sınır kullanılır; bu durumda bütçeye daha az kanıt sığabilir. Boş arama sonucu, uygun kanıt bulunamadığını gösterir; iddianın yanlış olduğunu kanıtlamaz.

## Sürümlü hukuki öğeler parça konumlarını korur

Yeni parçalar; citation, decision_ref, date, amount, duration ve outcome için `retrieval_provenance.legal_items` alanını `{version, items}` biçiminde döndürebilir. Sonuç daha kısa bir bilgi alıntılasa da `start`/`end`, özgün kaynak parçasını gösterir. Bu ekler SPO kayıtlarından ayrıdır ve birleştirme skoruna eklenmez. Hukuk kurallarını kapatmak, sonuç kopyalarındaki mevcut ekleri gizler; anlık görüntüleri silmez. Belge purge işlemi bunların kaynak alıntılarını siler.
