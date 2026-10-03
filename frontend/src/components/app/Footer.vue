<template>
  <footer id="kontak" class="site-footer">
    <div class="footer-wrap">
      <div class="footer-main">
        <div class="footer-brand-col">
          <RouterLink to="/" class="footer-brand" aria-label="Beranda Rumah Nafasy">
            <img src="/icons/64.png" alt="" aria-hidden="true" class="footer-brand-icon" />
            <span>Rumah Nafasy</span>
          </RouterLink>
        </div>

        <section v-for="group in menuGroups" :key="group.title" class="footer-col">
          <h2>{{ group.title }}</h2>
          <ul>
            <li v-for="item in group.items" :key="item.label">
              <a :href="item.href">{{ item.label }}</a>
            </li>
          </ul>
        </section>
      </div>

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

const menuGroups = [
  {
    title: 'Perusahaan',
    items: [
      { label: 'Harga layanan', href: '#' },
      { label: 'Ulasan klien', href: '#' },
      { label: 'Karier', href: '#' },
      { label: 'Pers & Media', href: '#' },
      { label: 'Riset & Data', href: '#' },
      { label: 'Tentang kami', href: '#' },
      { label: 'Keunggulan kami', href: '#' },
      { label: 'Program afiliasi', href: '#' },
      { label: 'Ajak teman', href: '#' },
      { label: 'Program advokat kesehatan mental', href: '#' },
    ],
  },
  {
    title: 'Sumber Daya',
    items: [
      { label: 'Pusat bantuan', href: '#' },
      { label: 'Komunitas kesehatan mental', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Kondisi kesehatan mental', href: '#' },
      { label: 'Tes kesehatan mental gratis', href: '#' },
      { label: 'Panduan mandiri', href: '#' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { label: 'Kebijakan privasi', href: '#' },
      { label: 'Syarat penggunaan', href: '#' },
      { label: 'Aksesibilitas', href: '#' },
      { label: 'Pengaturan privasi', href: '#' },
      { label: 'Hak privasi per wilayah', href: '#' },
      { label: 'Saluran pengaduan', href: '#' },
    ],
  },
]
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
  padding: 40px 0 20px;
}

.footer-main {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, minmax(0, 1fr));
  gap: 32px;
  padding-bottom: 32px;
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

.footer-col h2 {
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 600;
}

.footer-col ul {
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-col a,
.footer-social a {
  color: var(--muted, #686865);
  font-size: 13px;
  line-height: 1.5;
  text-decoration: none;
}

.footer-col a:hover,
.footer-social a:hover {
  color: var(--text, #242424);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--line, #e5e7eb);
  color: var(--muted, #686865);
}

.footer-bottom p {
  margin: 0;
  font-size: 12px;
}

.footer-social {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 760px) {
  .footer-main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 20px;
  }
}

@media (max-width: 480px) {
  .footer-wrap {
    padding-top: 28px;
  }

  .footer-main {
    grid-template-columns: 1fr 1fr;
    gap: 24px 16px;
  }

  .footer-brand-col {
    grid-column: 1 / -1;
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
