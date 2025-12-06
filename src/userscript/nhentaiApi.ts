import { fileType, t } from 'helper';
import { request } from 'main';

type ComicInfo = {
  id: number;
  media_id: string;
  num_pages: number;
  images: { pages: { t: string; w: number; h: number }[] };
  title: { japanese: string; english: string };
};

// 只要带上 cf_clearance cookie 就能通过 Cloudflare 验证，但其是 httpOnly
// 目前暴力猴还不支持 GM_Cookie，篡改猴也需要去设置里手动设置才能支持 httpOnly
// 所以暂不处理，就嗯等
// https://github.com/violentmonkey/violentmonkey/issues/603

export const getNhentaiData = async (id: string) => {
  const { response } = await request<ComicInfo>(
    `https://nhentai.net/api/gallery/${id}`,
    {
      responseType: 'json',
      errorText: t('site.ehentai.nhentai_error'),
      noTip: true,
      headers: { 'User-Agent': navigator.userAgent },
      fetch: false,
    },
  );
  return response;
};

export const searchNhentai = async (title: string) => {
  const { response } = await request<{ result: ComicInfo[] }>(
    `https://nhentai.net/api/galleries/search?query=${title}`,
    {
      responseType: 'json',
      errorText: t('site.ehentai.nhentai_error'),
      noTip: true,
      headers: { 'User-Agent': navigator.userAgent },
      fetch: false,
    },
  );
  return response.result;
};

export const toImgList = (data: ComicInfo) => {
  const { media_id, images } = data;
  return images.pages.map(
    ({ t }, i) =>
      `https://i.nhentai.net/galleries/${media_id}/${i + 1}.${fileType[t]}`,
  );
};
