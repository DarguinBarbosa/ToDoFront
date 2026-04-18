# ToDo Glass

Aplicación de lista de tareas construida con **Ionic 8 + Angular 20** (componentes standalone, signals), con diseño *glassmorphism*. Incluye categorías, persistencia local, *feature flag* vía **Firebase Remote Config** y empaquetado híbrido para **Android / iOS con Cordova**.

## Funcionalidades

- **Tareas**: crear, completar / desmarcar, ver detalle, eliminar. Persisten en `localStorage` (clave `glasstodo_state_v1`).
- **Categorías**: CRUD completo en `/categories` (nombre, emoji, color). Se asigna al crear tarea; al borrar una categoría sus tareas quedan como *Sin categoría*.
- **Filtro por categoría**: tap en una card de categoría en el Home filtra la lista; "Limpiar" restablece.
- **Dashboard**: estadísticas (Hoy / Hechas / Total), saludo dinámico, lista pendientes + completadas, FAB de creación, bottom nav.
- **Tema claro / oscuro**: botón sol/luna persistente (`glasstodo_theme`).
- **Feature flag**: `show_stats_row` (oculta el row de estadísticas) y `allow_category_create` (oculta el editor en Categorías), ambos servidos desde Firebase Remote Config con defaults seguros offline.

## Stack

| | |
|---|---|
| Framework | Ionic 8, Angular 20 standalone |
| Estado | Angular signals + `effect()` → `localStorage` |
| Estilo | SCSS + `backdrop-filter`, OKLCH, Inter (`@fontsource/inter`) |
| Remote Config | `@angular/fire` 20, `firebase` 11 |
| Empaquetado móvil | Cordova (Android / iOS) |

## Estructura

```
src/app/
├─ core/            modelos, servicios (store, storage, theme, feature flags)
├─ shared/          componentes reutilizables (glass, gradient-bg, task-item) + icon set SVG
└─ pages/
   ├─ home/         Dashboard (stats, categorías, lista, FAB)
   ├─ create-task/  formulario con hero input coloreado por categoría
   ├─ task-detail/  detalle con hero, toggle completar, meta y actividad
   └─ categories/   CRUD de categorías
```

## Desarrollo web

```bash
npm install
npm start                 # http://localhost:8100
npm run build             # build de producción → ./www
npm test                  # Karma + Jasmine
npm run lint
```

## Compilación Android (Cordova)

Requisitos: JDK 17, Android Studio + SDK 34, variables `ANDROID_HOME` / `ANDROID_SDK_ROOT`.

```bash
npm run build                            # genera /www
npx cordova platform add android@latest  # solo la primera vez
npx cordova prepare android
npx cordova build android                # debug
npx cordova build android --release      # APK sin firmar
```

APK generado en:
```
platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
```

Firmado:
```bash
keytool -genkey -v -keystore my.keystore -alias todoglass -keyalg RSA -keysize 2048 -validity 10000
apksigner sign --ks my.keystore --out app-release.apk app-release-unsigned.apk
```

Correr en emulador o dispositivo:
```bash
npx cordova run android
```

## Compilación iOS (Cordova)

Requiere **macOS** + Xcode 15 + CocoaPods + cuenta de desarrollador Apple para IPA.

```bash
npm run build
npx cordova platform add ios
npx cordova prepare ios
open platforms/ios/toDoList.xcworkspace
```

En Xcode: elegir *Team* de firma → *Product ▸ Archive* → *Distribute App* → `.ipa`.

## Firebase + Remote Config

1. Crear un proyecto en <https://console.firebase.google.com/> → *Add web app* → copiar la config.
2. Pegar los valores en `src/environments/environment.ts` (y `.prod.ts` para producción).
   Si `apiKey` queda vacía, la app funciona sin Firebase y usa los valores por defecto.
3. En *Remote Config* del proyecto, crear el parámetro:
   - `show_stats_row` — *Boolean*, default `true`.
   - (opcional) `allow_category_create` — *Boolean*, default `true`.
4. Publicar cambios. La app aplica el valor en el siguiente arranque (intervalo mínimo de fetch: 10 s en dev).

### Demo del feature flag

- `show_stats_row = true` → la fila de 3 tarjetas (*Hoy / Hechas / Total*) aparece bajo el saludo.
- Cambia a `false` en la consola y publica → recarga la app → la fila desaparece sin desplegar código.

## Optimización de rendimiento

- `ChangeDetectionStrategy.OnPush` en todos los componentes.
- **Signals + `computed`** para derivar `pendientes / completadas / stats`; no hay subscripciones RxJS en plantillas ni `async` pipes adicionales.
- `@for (t of tasks(); track t.id)` para DOM estable al completar tareas.
- **Lazy routes** (`loadComponent`) ya desde la base + `withPreloading(PreloadAllModules)`.
- Componentes `standalone` → tree-shaking de `@ionic/angular/standalone` (solo los `Ion*` usados).
- `@fontsource/inter` con 4 pesos locales (evita bloqueo por Google Fonts).
- `backdrop-filter` + orbes pre-renderizados con gradientes CSS (GPU compositing); sin imágenes.
- Budgets ajustados en `angular.json` (`initial 2mb/5mb`, `anyComponentStyle 6kb/10kb`).

## Respuestas a las preguntas de la prueba

### ¿Cuáles fueron los principales desafíos?
- **Implementar el lenguaje visual glassmorphism** (componentes `Glass`, `GradientBG`, pantallas de Home/Create/Detail) en la arquitectura standalone de Angular 20 sin perder fidelidad pixel-perfect (OKLCH, `backdrop-filter`, shine inset, transiciones).
- **Mantener `ion-content` transparente** sobre el `<app-gradient-bg>` global: requiere override del CSS custom property `--background` y de los backgrounds por defecto de `ion-app`/`ion-router-outlet`.
- **Coordinar estado reactivo entre pantallas** (filtro por categoría, creación, toggles) con una sola fuente de verdad (`TaskStore` basado en signals) y persistencia automática vía `effect()`.
- **Hacer opcional Firebase**: la app debe seguir funcionando sin credenciales para evaluación offline → el bootstrap sólo inyecta providers cuando `apiKey` está presente y `FeatureFlagService` cae a defaults si `fetchAndActivate` falla.

### ¿Qué técnicas de rendimiento aplicaste y por qué?
- **Signals** en lugar de RxJS/Zone-driven CD: sólo las vistas que dependen de cada señal se actualizan; el almacén persiste vía `effect()` sin `BehaviorSubject` + suscripciones.
- **OnPush** en todos los componentes: anula CD innecesarias al pulsar botones que no tocan entradas.
- **Lazy `loadComponent`** por ruta → la home inicial carga ~4 kB de chunk propia, el resto baja bajo demanda con preload.
- **`@for track`** por `id` estable: completar una tarea no re-crea nodos, sólo toggle visual.
- **Estilos CSS puros** (sin imágenes) para el glassmorphism: el GPU compone `backdrop-filter` con menor coste que texturas.
- **Fuentes locales** (`@fontsource/inter`) → evitan Round-Trip a Google Fonts y evitan *layout shift*.
- **Budgets** endurecidos para detectar regresiones de bundle en CI.

### ¿Cómo aseguraste la calidad y mantenibilidad?
- **Separación en capas** `core / shared / pages` con la regla `pages → shared → core` y *nunca* al revés — facilita test y refactor.
- **Modelos tipados** (`Task`, `Category`, `Priority`, `Due`) y un único store mutado mediante métodos acotados (`addTask`, `toggleTask`, etc.).
- **Primitivos de UI reutilizables** (`<app-glass>`, `<app-gradient-bg>`, `<app-task-item>`, `<app-icon>`) → un cambio de estilo se propaga a toda la app.
- **ESLint** (`@angular-eslint` 20) con prefijo `app` y reglas standalone.
- **Offline-first**: localStorage como fuente de verdad, Firebase sólo como *override* de flags.
- **Comentarios mínimos pero útiles** (e.g. por qué `apiKey` vacío es seguro, por qué se chequea `window` antes de `localStorage`).
