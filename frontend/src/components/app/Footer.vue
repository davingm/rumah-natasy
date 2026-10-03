<template>
  <footer id="kontak" class="site-footer">
    <div class="footer-wrap">
      <RouterLink to="/" class="footer-brand" aria-label="Beranda Rumah Nafasy">
        <img src="/icons/64.png" alt="" aria-hidden="true" class="footer-brand-icon" />
        <span>Rumah Nafasy</span>
      </RouterLink>

      <nav class="footer-nav" aria-label="Navigasi footer">
        <RouterLink to="/service">Layanan</RouterLink>
        <RouterLink to="/about">Tentang</RouterLink>
        <RouterLink to="/gallry">Galeri</RouterLink>
      </nav>

      <div class="footer-bottom">
        <p>{{ copyright }}</p>
        <nav v-if="socialLinks?.length" class="footer-social" aria-label="Media sosial Rumah Nafasy">
          <a
            v-for="social in socialLinks"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noreferrer"
          >{{ social.label }}</a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
type SocialLink = {
  label: string
  href: string
  icon: 'bluesky' | 'instagram' | 'tiktok' | 'x'
}

defineProps<{
  copyright: string
  socialLinks?: SocialLink[]
}>()
</script>

<style scoped>
.site-footer {
  width: 100%;
  border-top: 1px solid var(--line, #e5e7eb);
  background: var(--background, #fff);
  color: var(--text, #242424);
}

.footer-wrap {
  width: min(100% - 2rem, 1280px);
  margin: 0 auto;
  padding: 32px 0 20px;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  font-weight: 650;
  text-decoration: none;
}

.footer-brand-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.footer-nav,
.footer-social {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-nav {
  margin-top: 20px;
}

.footer-nav a,
.footer-social a {
  color: inherit;
  font-size: 14px;
  text-decoration: none;
}

.footer-nav a:hover,
.footer-social a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--line, #e5e7eb);
  color: var(--muted, #686865);
}

.footer-bottom p {
  margin: 0;
  font-size: 13px;
}

.footer-social {
  gap: 16px;
}

.footer-social a {
  color: var(--muted, #686865);
  font-size: 13px;
}

@media (max-width: 600px) {
  .footer-wrap {
    padding-top: 24px;
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

