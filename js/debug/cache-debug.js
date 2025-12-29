/**
 * DEBUG KONZOLA PRE CACHE
 * Pomocný súbor na testovanie a debugging cache systému
 * 
 * Použi v browser console:
 * - debugCacheInfo() - zobrazí info o cache
 * - clearAllCache() - vymaže celú cache
 * - getCacheSize() - zistí veľkosť cache
 * - testPreloading() - otestuje preloading systém
 */

// ==========================================
// DEBUG FUNKCIE PRE CACHE
// ==========================================

/**
 * Zobrazí detailné informácie o cache
 */
async function debugCacheInfo() {
    console.log('╔════════════════════════════════════╗');
    console.log('║     CACHE DEBUG INFORMÁCIE         ║');
    console.log('╚════════════════════════════════════╝');
    console.log('');
    
    // 1. Cache verzia a názov
    console.log('📋 KONFIGURÁCIA:');
    console.log(`   Cache verzia: ${typeof CACHE_VERSION !== 'undefined' ? CACHE_VERSION : 'N/A'}`);
    console.log(`   Cache name: ${typeof CACHE_NAME !== 'undefined' ? CACHE_NAME : 'N/A'}`);
    console.log('');
    
    // 2. Cache veľkosť
    console.log('💾 CACHE STORAGE:');
    if (typeof getCacheSize === 'function') {
        const size = await getCacheSize();
        console.log(`   Veľkosť: ${size.sizeMB} MB`);
        console.log(`   Počet súborov: ${size.itemCount}`);
        
        // Zoznam súborov v cache
        try {
            const cache = await caches.open(CACHE_NAME);
            const keys = await cache.keys();
            console.log(`   Súbory v cache:`);
            keys.forEach((request, index) => {
                console.log(`      ${index + 1}. ${request.url}`);
            });
        } catch (error) {
            console.warn('   Chyba pri získavaní zoznamu súborov:', error);
        }
    } else {
        console.log('   Funkcia getCacheSize nie je dostupná');
    }
    console.log('');
    
    // 3. In-memory cache
    console.log('🧠 IN-MEMORY CACHE:');
    if (typeof preloadedImages !== 'undefined') {
        console.log(`   Načítané obrázky: ${Object.keys(preloadedImages).length}`);
        console.log(`   Zoznam načítaných:`);
        Object.keys(preloadedImages).forEach((key, index) => {
            console.log(`      ${index + 1}. ${key}`);
        });
    } else {
        console.log('   preloadedImages nie je dostupný');
    }
    console.log('');
    
    // 4. Stav preloadingu
    console.log('📊 STAV PRELOADINGU:');
    console.log(`   Dokončený: ${typeof isPreloadingDone === 'function' ? isPreloadingDone() : 'N/A'}`);
    console.log(`   Celkovo zdrojov: ${typeof totalResources !== 'undefined' ? totalResources : 'N/A'}`);
    console.log(`   Načítaných: ${typeof loadedResources !== 'undefined' ? loadedResources : 'N/A'}`);
    console.log('');
    
    // 5. Browser storage info
    if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const usage = (estimate.usage / (1024 * 1024)).toFixed(2);
        const quota = (estimate.quota / (1024 * 1024)).toFixed(2);
        const percentage = ((estimate.usage / estimate.quota) * 100).toFixed(2);
        
        console.log('💽 CELKOVÉ STORAGE:');
        console.log(`   Použité: ${usage} MB`);
        console.log(`   Dostupné: ${quota} MB`);
        console.log(`   Percento: ${percentage}%`);
    }
    
    console.log('');
    console.log('════════════════════════════════════');
}

/**
 * Test preloading systému
 */
async function testPreloading() {
    console.log('🧪 TESTOVANIE PRELOADING SYSTÉMU');
    console.log('================================');
    
    // Skontroluj či sú dostupné potrebné funkcie
    console.log('');
    console.log('1️⃣ Kontrolujem dostupnosť funkcií...');
    const functions = [
        'startWorldsMenuPreloading',
        'preloadImageWithCache',
        'loadFromCache',
        'loadImageFromNetwork',
        'saveToCache',
        'cleanOldCaches',
        'getCacheSize',
        'clearAllCache'
    ];
    
    functions.forEach(funcName => {
        const isAvailable = typeof window[funcName] === 'function';
        console.log(`   ${isAvailable ? '✅' : '❌'} ${funcName}`);
    });
    
    // Skontroluj globálne premenné
    console.log('');
    console.log('2️⃣ Kontrolujem globálne premenné...');
    const variables = [
        'CACHE_VERSION',
        'CACHE_NAME',
        'preloadedImages',
        'totalResources',
        'loadedResources',
        'isPreloadingComplete'
    ];
    
    variables.forEach(varName => {
        const isAvailable = typeof window[varName] !== 'undefined';
        const value = window[varName];
        console.log(`   ${isAvailable ? '✅' : '❌'} ${varName} = ${JSON.stringify(value)}`);
    });
    
    // Test cache operácií
    console.log('');
    console.log('3️⃣ Testujem cache operácie...');
    
    try {
        // Test otvorenia cache
        const cache = await caches.open(CACHE_NAME);
        console.log('   ✅ Cache úspešne otvorená');
        
        // Test uloženia
        const testUrl = 'test-image.png';
        const testResponse = new Response('test data');
        await cache.put(testUrl, testResponse);
        console.log('   ✅ Testovací súbor uložený');
        
        // Test načítania
        const retrieved = await cache.match(testUrl);
        console.log(`   ✅ Testovací súbor načítaný: ${retrieved ? 'áno' : 'nie'}`);
        
        // Test vymazania
        await cache.delete(testUrl);
        console.log('   ✅ Testovací súbor vymazaný');
        
    } catch (error) {
        console.error('   ❌ Chyba pri teste cache:', error);
    }
    
    console.log('');
    console.log('✅ Test dokončený!');
    console.log('================================');
}

/**
 * Vymazanie všetkých cache a reload stránky
 */
async function resetCacheAndReload() {
    console.log('🔄 RESETUJEM CACHE A RELOADUJEM STRÁNKU...');
    
    try {
        // Vymaž všetky cache
        const cacheNames = await caches.keys();
        
        for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
            console.log(`✅ Vymazaná cache: ${cacheName}`);
        }
        
        console.log('✅ Všetky cache vymazané!');
        console.log('🔄 Reloadujem stránku za 2 sekundy...');
        
        setTimeout(() => {
            location.reload(true); // Force reload
        }, 2000);
        
    } catch (error) {
        console.error('❌ Chyba pri resetovaní cache:', error);
    }
}

/**
 * Porovnanie rýchlosti s/bez cache
 */
async function compareLoadingSpeed() {
    console.log('⏱️ POROVNANIE RÝCHLOSTI NAČÍTAVANIA');
    console.log('===================================');
    
    // Testovací obrázok
    const testImage = 'images/worlds/world_r.png';
    
    // 1. Test načítania zo siete (bez cache)
    console.log('');
    console.log('1️⃣ Načítanie zo siete (bez cache)...');
    
    // Vymaž z cache ak tam je
    const cache = await caches.open(CACHE_NAME);
    await cache.delete(new URL(testImage, window.location.href).href);
    
    const networkStart = performance.now();
    await fetch(testImage);
    const networkTime = performance.now() - networkStart;
    
    console.log(`   ⏱️ Čas: ${networkTime.toFixed(2)} ms`);
    
    // 2. Test načítania z cache
    console.log('');
    console.log('2️⃣ Načítanie z cache...');
    
    // Ulož do cache
    const response = await fetch(testImage);
    await cache.put(new URL(testImage, window.location.href).href, response);
    
    const cacheStart = performance.now();
    await cache.match(new URL(testImage, window.location.href).href);
    const cacheTime = performance.now() - cacheStart;
    
    console.log(`   ⏱️ Čas: ${cacheTime.toFixed(2)} ms`);
    
    // 3. Výsledok
    console.log('');
    console.log('📊 VÝSLEDOK:');
    const speedup = (networkTime / cacheTime).toFixed(2);
    console.log(`   Sieť: ${networkTime.toFixed(2)} ms`);
    console.log(`   Cache: ${cacheTime.toFixed(2)} ms`);
    console.log(`   Zrýchlenie: ${speedup}x rýchlejšie!`);
    console.log('');
    console.log('===================================');
}

/**
 * Zobrazenie všetkých dostupných cache
 */
async function listAllCaches() {
    console.log('📚 ZOZNAM VŠETKÝCH CACHE');
    console.log('========================');
    
    try {
        const cacheNames = await caches.keys();
        
        console.log(`Celkovo cache: ${cacheNames.length}`);
        console.log('');
        
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            
            console.log(`📦 ${cacheName}`);
            console.log(`   Súbory: ${keys.length}`);
            
            // Vypočítaj veľkosť
            let totalSize = 0;
            for (const request of keys) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    totalSize += blob.size;
                }
            }
            
            const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
            console.log(`   Veľkosť: ${sizeMB} MB`);
            console.log('');
        }
        
        console.log('========================');
        
    } catch (error) {
        console.error('Chyba pri získavaní cache:', error);
    }
}

// ==========================================
// EXPORT DO WINDOW
// ==========================================

if (typeof window !== 'undefined') {
    // Pridaj do window pre jednoduchý prístup z konzoly
    window.debugCache = {
        info: debugCacheInfo,
        test: testPreloading,
        reset: resetCacheAndReload,
        compare: compareLoadingSpeed,
        list: listAllCaches
    };
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  🛠️  DEBUG CACHE KONZOLA NAČÍTANÁ  🛠️');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('Dostupné príkazy:');
    console.log('');
    console.log('  debugCache.info()      - Zobrazí detaily o cache');
    console.log('  debugCache.test()      - Otestuje preloading systém');
    console.log('  debugCache.reset()     - Vymaže cache a reloadne stránku');
    console.log('  debugCache.compare()   - Porovná rýchlosť cache vs sieť');
    console.log('  debugCache.list()      - Zobrazí všetky cache');
    console.log('');
    console.log('  // Alebo použiť priamo:');
    console.log('  debugCacheInfo()       - To isté ako debugCache.info()');
    console.log('  clearAllCache()        - Vymaže aktuálnu cache');
    console.log('  getCacheSize()         - Vráti veľkosť cache');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
}