import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Site-builder section background: dark luxury vs light editorial (see `wb-surface-lux` / `wb-surface-light` in globals.css). */
export type SectionSurfaceTone = 'light' | 'dark'

export function sectionSurfaceClass(tone: SectionSurfaceTone = 'dark') {
  return tone === 'light' ? 'wb-surface-light' : 'wb-surface-lux'
}

function parseColorToRgb(color: string): [number, number, number] | null {
  const c = color.trim()
  if (c.startsWith('#')) {
    let hex = c.slice(1)
    if (hex.length === 3) hex = hex.split('').map((ch) => ch + ch).join('')
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ]
    }
  }
  const rgb = c.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i)
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
  return null
}

/** Infer light vs dark section tokens from the site builder page background color. */
export function pageSurfaceToneFromBackground(color?: string | null): SectionSurfaceTone {
  if (!color?.trim()) return 'light'
  const rgb = parseColorToRgb(color)
  if (!rgb) return 'light'
  const [r, g, b] = rgb.map((v) => v / 255)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.55 ? 'light' : 'dark'
}

export function sectionHairlineClass(tone: SectionSurfaceTone = 'dark') {
  return tone === 'light' ? 'wb-hairline-t-light' : 'wb-hairline-t'
}

export function sectionTextPrimaryClass(tone: SectionSurfaceTone = 'dark') {
  return tone === 'light' ? 'wb-text-on-light' : 'wb-text-on-dark'
}

export function sectionTextSecondaryClass(tone: SectionSurfaceTone = 'dark') {
  return tone === 'light' ? 'wb-text-on-light-secondary' : 'wb-text-on-dark-secondary'
}

export function sectionBorderClass(tone: SectionSurfaceTone = 'dark') {
  return tone === 'light' ? 'wb-border-on-light' : 'wb-border-on-dark'
}

export function sectionGlassClass(tone: SectionSurfaceTone = 'dark', strong = false) {
  if (tone === 'light') return strong ? 'wb-glass-on-light-strong' : 'wb-glass-on-light'
  return strong ? 'wb-glass-on-dark-strong' : 'wb-glass-on-dark'
}

export function sectionTextCssVar(tone: SectionSurfaceTone = 'dark') {
  return tone === 'light' ? 'var(--wb-text-main)' : 'var(--wb-text-on-dark)'
}

/** Tiptap blocks inherit parent section text color; links use theme primary. */
export const TIPTAP_INHERIT =
  'max-w-none text-inherit [&_a]:text-[var(--wb-primary)] [&_a]:underline-offset-4 [&_a:hover]:opacity-90 [&_em]:text-inherit [&_li]:text-inherit [&_p]:mt-0 [&_p]:text-inherit [&_strong]:text-inherit'

/**
 * Normalizes NEXT_PUBLIC_API_BASE_URL to `{origin}/api` (see IMAGE_URL_GUIDE /
 * PUBLIC_ROUTES_DOCUMENTATION — files are served at /api/uploads/*).
 */
function getApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
    (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000/api')
  if (!raw) return ''
  return /\/api$/i.test(raw) ? raw : `${raw}/api`
}

function extractUploadsFilename(input: string): string | null {
  const matchPathname = (pathname: string) => {
    const m = pathname.match(/^\/(?:api\/)?uploads\/(.+)$/i)
    return m?.[1] ?? null
  }
  if (/^https?:\/\//i.test(input)) {
    try {
      return matchPathname(new URL(input).pathname)
    } catch {
      return null
    }
  }
  const p = input.replace(/^\//, '')
  const m = p.match(/^(?:api\/)?uploads\/(.+)$/i)
  return m?.[1] ?? null
}

/**
 * Resolves image URLs for Media Library images via the public route /api/uploads/*.
 * - Same-origin absolute URLs under /uploads/ are rewritten to /api/uploads/
 * - Other absolute http(s) URLs are returned unchanged (aside from http→https when not local)
 */
export function getImageSrc(path: string | undefined | null | any): string {
  if (!path) return ''

  const pathStr = String(path)

  if (!pathStr) return ''

  if (pathStr.startsWith('data:')) return pathStr

  const apiBase = getApiBaseUrl()
  const isLocalApi = /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\b/i.test(
    apiBase
  )
  const resolvedApiBase = isLocalApi
    ? apiBase
    : apiBase.replace(/^http:\/\//i, 'https://')

  if (/^https?:\/\//i.test(pathStr)) {
    const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\b/i.test(
      pathStr
    )
    let out = isLocal ? pathStr : pathStr.replace(/^http:\/\//i, 'https://')
    if (!resolvedApiBase) return out
    try {
      const u = new URL(out)
      const apiOrigin = new URL(resolvedApiBase).origin
      const filename = extractUploadsFilename(pathStr)
      const isBackendUpload =
        u.pathname.startsWith('/uploads/') || u.pathname.startsWith('/api/uploads/')
      if (u.origin === apiOrigin && filename && isBackendUpload) {
        return `${resolvedApiBase}/uploads/${filename}`
      }
    } catch {
      /* ignore */
    }
    return out
  }

  if (!resolvedApiBase) {
    const rel = pathStr.replace(/^\//, '')
    const filenameOnly = extractUploadsFilename(rel) ?? rel.replace(/^(?:api\/)?uploads\//i, '')
    return `/api/uploads/${filenameOnly}`
  }

  const filenameFromPath = extractUploadsFilename(pathStr)
  if (filenameFromPath) {
    return `${resolvedApiBase}/uploads/${filenameFromPath}`
  }

  let cleanPath = pathStr.replace(/^\//, '')
  if (cleanPath.startsWith('uploads/')) {
    cleanPath = cleanPath.slice('uploads/'.length)
  }
  if (cleanPath.startsWith('api/uploads/')) {
    cleanPath = cleanPath.slice('api/uploads/'.length)
  }

  return `${resolvedApiBase}/uploads/${cleanPath}`
}
