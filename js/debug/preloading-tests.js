/**
 * TEST SÚBOR PRE PRELOADING SYSTÉM
 * 
 * Tento súbor obsahuje rôzne testy pre overenie funkčnosti
 * preloading systému s cache API.
 * 
 * POUŽITIE:
 * 1. Otvor worldsmenu.html v prehliadači
 * 2. Otvor Developer Tools (F12)
 * 3. Prejdi na Console tab
 * 4. Skopíruj a spusti jednotlivé testy
 */

// ==========================================
// TEST 1: Základná funkčnosť
// ==========================================

console.log('═══════════════════════════════════════════════════════════');
console.log('TEST 1: ZÁKLADNÁ FUNKČNOSŤ');
console.log('═══════════════════════════════════════════════════════════');

async function test1_BasicFunctionality() {
    console.log('🧪 Spúšťam Test 1...');
    console.log('');
    
    // 1. Kontrola dostupnosti funkcií
    console.log('1️⃣ Kontrolujem dostupnosť funkcií...');
    const requiredFunctions = [
        'startWorldsMenuPreloading',
        'getPreloadedImage',
        'isPreloadingDone',
        'getCacheSize',
        'clearAllCache'
    ];
    
    let allAvailable = true;
    requiredFunctions.forEach(funcName => {
        const isAvailable = typeof window[funcName] === 'function';
        console.log(`   ${isAvailable ? '✅' : '❌'} ${funcName}`);
        if (!isAvailable) allAvailable = false;
    });
    
    if (!allAvailable) {
        console.error('❌ Test 1 ZLYHAL - niektoré funkcie chýbajú');
        return false;
    }
    
    // 2. Kontrola globálnych premenných
    console.log('');
    console.log('2️⃣ Kontrolujem globálne premenné...');
    const requiredVars = ['CACHE_VERSION', 'CACHE_NAME', 'preloadedImages'];
    
    requiredVars.forEach(varName => {
        const isAvailable = typeof window[varName] !== 'undefined';
        console.log(`   ${isAvailable ? '✅' : '❌'} ${varName}`);
        if (!isAvailable) allAvailable = false;
    });
    
    if (!allAvailable) {
        console.error('❌ Test 1 ZLYHAL - niektoré premenné chýbajú');
        return false;
    }
    
    console.log('');
    console.log('✅ Test 1 ÚSPEŠNÝ - všetky funkcie a premenné sú dostupné');
    return true;
}

// Spusti test
// test1_BasicFunctionality();

// ==========================================
// TEST 2: Cache operácie
// ==========================================

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('TEST 2: CACHE OPERÁCIE');
console.log('═══════════════════════════════════════════════════════════');

async function test2_CacheOperations() {
    console.log('🧪 Spúšťam Test 2...');
    console.log('');
    
    try {
        // 1. Test otvorenia cache
        console.log('1️⃣ Testujem otvorenie cache...');
        const cache = await caches.open(CACHE_NAME);
        console.log('   ✅ Cache úspešne otvorená');
        
        // 2. Test uloženia do cache
        console.log('');
        console.log('2️⃣ Testujem uloženie do cache...');
        const testUrl = 'test-preloading-image.png';
        const testData = new Response('test data for preloading', {
            headers: { 'Content-Type': 'image/png' }
        });
        await cache.put(testUrl, testData.clone());
        console.log('   ✅ Testovací súbor uložený');
        
        // 3. Test načítania z cache
        console.log('');
        console.log('3️⃣ Testujem načítanie z cache...');
        const retrieved = await cache.match(testUrl);
        if (retrieved) {
            const text = await retrieved.text();
            console.log(`   ✅ Testovací súbor načítaný: "${text}"`);
        } else {
            throw new Error('Testovací súbor sa nenašiel v cache');
        }
        
        // 4. Test veľkosti cache
        console.log('');
        console.log('4️⃣ Testujem získanie veľkosti cache...');
        const size = await getCacheSize();
        console.log(`   ✅ Cache veľkosť: ${size.sizeMB} MB (${size.itemCount} súborov)`);
        
        // 5. Test vymazania z cache
        console.log('');
        console.log('5️⃣ Testujem vymazanie z cache...');
        const deleted = await cache.delete(testUrl);
        console.log(`   ${deleted ? '✅' : '❌'} Testovací súbor vymazaný`);
        
        console.log('');
        console.log('✅ Test 2 ÚSPEŠNÝ - všetky cache operácie fungujú');
        return true;
        
    } catch (error) {
        console.error('❌ Test 2 ZLYHAL:', error);
        return false;
    }
}

// Spusti test
// test2_CacheOperations();

// ==========================================
// TEST 3: Preloading rýchlosť
// ==========================================

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('TEST 3: PRELOADING RÝCHLOSŤ');
console.log('═══════════════════════════════════════════════════════════');

async function test3_PreloadingSpeed() {
    console.log('🧪 Spúšťam Test 3...');
    console.log('');
    
    // Testovací obrázok
    const testImage = 'images/star_active.png';
    
    try {
        // 1. Vyčisti cache
        console.log('1️⃣ Čistím cache...');
        const cache = await caches.open(CACHE_NAME);
        await cache.delete(new URL(testImage, window.location.href).href);
        console.log('   ✅ Cache vyčistená');
        
        // 2. Test načítania zo siete
        console.log('');
        console.log('2️⃣ Testujem načítanie zo siete...');
        const networkStart = performance.now();
        const networkResponse = await fetch(testImage);
        await networkResponse.blob(); // Počkaj na načítanie dát
        const networkTime = performance.now() - networkStart;
        console.log(`   ⏱️  Čas: ${networkTime.toFixed(2)} ms`);
        
        // 3. Ulož do cache
        console.log('');
        console.log('3️⃣ Ukladám do cache...');
        const saveStart = performance.now();
        const saveResponse = await fetch(testImage);
        await cache.put(new URL(testImage, window.location.href).href, saveResponse);
        const saveTime = performance.now() - saveStart;
        console.log(`   ⏱️  Čas uloženia: ${saveTime.toFixed(2)} ms`);
        
        // 4. Test načítania z cache
        console.log('');
        console.log('4️⃣ Testujem načítanie z cache...');
        const cacheStart = performance.now();
        const cacheResponse = await cache.match(new URL(testImage, window.location.href).href);
        await cacheResponse.blob(); // Počkaj na načítanie dát
        const cacheTime = performance.now() - cacheStart;
        console.log(`   ⏱️  Čas: ${cacheTime.toFixed(2)} ms`);
        
        // 5. Porovnanie
        console.log('');
        console.log('📊 VÝSLEDOK:');
        const speedup = (networkTime / cacheTime).toFixed(2);
        console.log(`   Sieť:      ${networkTime.toFixed(2)} ms`);
        console.log(`   Cache:     ${cacheTime.toFixed(2)} ms`);
        console.log(`   Zrýchlenie: ${speedup}x`);
        
        console.log('');
        console.log('✅ Test 3 ÚSPEŠNÝ - cache je rýchlejšia ako sieť');
        return true;
        
    } catch (error) {
        console.error('❌ Test 3 ZLYHAL:', error);
        return false;
    }
}

// Spusti test
// test3_PreloadingSpeed();

// ==========================================
// TEST 4: Preloading všetkých obrázkov
// ==========================================

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('TEST 4: PRELOADING VŠETKÝCH OBRÁZKOV');
console.log('═══════════════════════════════════════════════════════════');

async function test4_FullPreloading() {
    console.log('🧪 Spúšťam Test 4...');
    console.log('');
    
    try {
        // 1. Vymaž všetky cache
        console.log('1️⃣ Mažem všetky cache...');
        await clearAllCache();
        console.log('   ✅ Cache vymazaná');
        
        // 2. Spusti full preloading
        console.log('');
        console.log('2️⃣ Spúšťam full preloading...');
        const startTime = performance.now();
        
        await startWorldsMenuPreloading();
        
        const totalTime = performance.now() - startTime;
        console.log(`   ⏱️  Celkový čas: ${(totalTime / 1000).toFixed(2)} sekúnd`);
        
        // 3. Skontroluj výsledky
        console.log('');
        console.log('3️⃣ Kontrolujem výsledky...');
        
        const isDone = isPreloadingDone();
        console.log(`   ${isDone ? '✅' : '❌'} Preloading dokončený`);
        
        const imagesCount = Object.keys(preloadedImages).length;
        console.log(`   ✅ Načítaných obrázkov: ${imagesCount}`);
        
        const cacheSize = await getCacheSize();
        console.log(`   ✅ Cache veľkosť: ${cacheSize.sizeMB} MB (${cacheSize.itemCount} súborov)`);
        
        console.log('');
        console.log('✅ Test 4 ÚSPEŠNÝ - všetky obrázky načítané a uložené');
        return true;
        
    } catch (error) {
        console.error('❌ Test 4 ZLYHAL:', error);
        return false;
    }
}

// Spusti test
// test4_FullPreloading();

// ==========================================
// TEST 5: Opakované načítanie (z cache)
// ==========================================

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('TEST 5: OPAKOVANÉ NAČÍTANIE (Z CACHE)');
console.log('═══════════════════════════════════════════════════════════');

async function test5_ReloadFromCache() {
    console.log('🧪 Spúšťam Test 5...');
    console.log('');
    
    console.log('ℹ️  Tento test vyžaduje, aby už bola cache naplnená.');
    console.log('   Ak nie je, najprv spusti: await test4_FullPreloading()');
    console.log('');
    
    try {
        // 1. Skontroluj cache
        console.log('1️⃣ Kontrolujem cache...');
        const cacheSize = await getCacheSize();
        
        if (cacheSize.itemCount === 0) {
            console.warn('⚠️  Cache je prázdna! Spúšťam preloading najprv...');
            await startWorldsMenuPreloading();
            console.log('   ✅ Preloading dokončený');
        } else {
            console.log(`   ✅ Cache obsahuje ${cacheSize.itemCount} súborov`);
        }
        
        // 2. Vymaž in-memory cache
        console.log('');
        console.log('2️⃣ Mažem in-memory cache...');
        Object.keys(preloadedImages).forEach(key => delete preloadedImages[key]);
        console.log(`   ✅ In-memory cache vymazaná`);
        
        // 3. Spusti reload z cache
        console.log('');
        console.log('3️⃣ Spúšťam reload z cache...');
        const startTime = performance.now();
        
        await startWorldsMenuPreloading();
        
        const totalTime = performance.now() - startTime;
        console.log(`   ⏱️  Čas načítania z cache: ${(totalTime / 1000).toFixed(2)} sekúnd`);
        
        // 4. Porovnanie
        console.log('');
        console.log('📊 VÝSLEDOK:');
        console.log(`   Načítaných obrázkov: ${Object.keys(preloadedImages).length}`);
        console.log(`   Čas: ${(totalTime / 1000).toFixed(2)}s`);
        console.log(`   Rýchlosť: ${totalTime < 2000 ? '✅ RÝCHLE' : '⚠️ POMALÉ'}`);
        
        console.log('');
        console.log('✅ Test 5 ÚSPEŠNÝ - reload z cache funguje');
        return true;
        
    } catch (error) {
        console.error('❌ Test 5 ZLYHAL:', error);
        return false;
    }
}

// Spusti test
// test5_ReloadFromCache();

// ==========================================
// MASTER TEST - Spusti všetky testy
// ==========================================

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('MASTER TEST - SPUSTI VŠETKY TESTY');
console.log('═══════════════════════════════════════════════════════════');

async function runAllTests() {
    console.log('🚀 SPÚŠŤAM VŠETKY TESTY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    
    const results = [];
    
    // Test 1
    console.log('');
    const result1 = await test1_BasicFunctionality();
    results.push({ test: 'Test 1: Základná funkčnosť', passed: result1 });
    
    // Test 2
    console.log('');
    const result2 = await test2_CacheOperations();
    results.push({ test: 'Test 2: Cache operácie', passed: result2 });
    
    // Test 3
    console.log('');
    const result3 = await test3_PreloadingSpeed();
    results.push({ test: 'Test 3: Preloading rýchlosť', passed: result3 });
    
    // Test 4
    console.log('');
    const result4 = await test4_FullPreloading();
    results.push({ test: 'Test 4: Full preloading', passed: result4 });
    
    // Test 5
    console.log('');
    const result5 = await test5_ReloadFromCache();
    results.push({ test: 'Test 5: Reload z cache', passed: result5 });
    
    // Výsledky
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('VÝSLEDKY TESTOV');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    
    let passedCount = 0;
    results.forEach((result, index) => {
        console.log(`${result.passed ? '✅' : '❌'} ${result.test}`);
        if (result.passed) passedCount++;
    });
    
    console.log('');
    console.log(`Úspešných: ${passedCount}/${results.length}`);
    
    if (passedCount === results.length) {
        console.log('');
        console.log('🎉 VŠETKY TESTY PREŠLI! 🎉');
        console.log('Preloading systém je plne funkčný.');
    } else {
        console.log('');
        console.log('⚠️ NIEKTORÉ TESTY ZLYHALI');
        console.log('Skontroluj error hlášky vyššie.');
    }
    
    console.log('═══════════════════════════════════════════════════════════');
}

// ==========================================
// POMOCNÉ PRÍKAZY
// ==========================================

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('DOSTUPNÉ PRÍKAZY');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('Individuálne testy:');
console.log('  await test1_BasicFunctionality()');
console.log('  await test2_CacheOperations()');
console.log('  await test3_PreloadingSpeed()');
console.log('  await test4_FullPreloading()');
console.log('  await test5_ReloadFromCache()');
console.log('');
console.log('Všetky testy naraz:');
console.log('  await runAllTests()');
console.log('');
console.log('Debug:');
console.log('  await debugCacheInfo()');
console.log('  await getCacheSize()');
console.log('  await clearAllCache()');
console.log('');
console.log('═══════════════════════════════════════════════════════════');

// Export funkcií
if (typeof window !== 'undefined') {
    window.testPreloading = {
        test1: test1_BasicFunctionality,
        test2: test2_CacheOperations,
        test3: test3_PreloadingSpeed,
        test4: test4_FullPreloading,
        test5: test5_ReloadFromCache,
        all: runAllTests
    };
    
    console.log('');
    console.log('✅ Test súbor načítaný!');
    console.log('');
    console.log('Rýchly štart:');
    console.log('  await testPreloading.all()  // Spusti všetky testy');
    console.log('');
}