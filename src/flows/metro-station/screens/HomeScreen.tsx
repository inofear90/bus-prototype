import { Icon, IconButton, Screen, Text, useToast } from '@ds';
import { useNavigation } from '@app/navigation';
import s from './HomeScreen.module.css';

import heroImg from '../assets/home-hero.jpg';
import routesImg from '../assets/feature-routes.png';
import passImg from '../assets/feature-monthly-pass.png';
import stopsImg from '../assets/feature-stops.png';

const FEATURES = [
  { key: 'routes', top: 'Tra cứu', title: 'Tuyến xe', tone: s.blue, img: routesImg },
  { key: 'pass', top: 'Mua/Quản lý', title: 'Vé tháng', tone: s.green, img: passImg },
  { key: 'stops', top: 'Tra cứu', title: 'Trạm xe', tone: s.yellow, img: stopsImg },
] as const;

/** VinBus home – entry point of the flow ("Tra cứu Trạm xe"). Tin Xanh cards are still placeholders. */
export function HomeScreen() {
  const { push } = useNavigation();
  const toast = useToast();
  const outOfScope = () => toast('Ngoài phạm vi prototype');

  return (
    <Screen className={s.screen}>
      <div className={s.scroll}>
        <header className={s.hero}>
          <img className={s.heroArt} src={heroImg} alt="" aria-hidden />
          <div className={s.heroActions}>
            <IconButton icon="arrow-left" label="Quay lại" variant="floating" size="md" shape="round" onClick={outOfScope} />
            <span className={s.spacer} />
            <IconButton icon="headset" label="Hỗ trợ" variant="floating" size="md" shape="round" onClick={outOfScope} />
            <IconButton icon="heart-line" label="Yêu thích" variant="floating" size="md" shape="round" onClick={outOfScope} />
          </div>
          <div className={s.title}>
            <Text variant="head-h4-smb" tone="primary" as="h1">VinBus</Text>
            <Text variant="body-md-reg" tone="secondary" as="p">Giao thông xanh vì một<br />tương lai trong lành.</Text>
          </div>
        </header>

        <section className={s.body}>
          <button type="button" className={s.city} onClick={outOfScope}>
            <Text variant="title-lg-md" tone="primary">Tại</Text>
            <Text variant="title-lg-md" tone="brand">Hồ Chí Minh</Text>
            <Icon name="angle-down" size={16} style={{ color: 'var(--icon-brand)' }} />
          </button>
          <button type="button" className={s.search} onClick={outOfScope}>
            <Icon name="pin-location" size={20} style={{ color: 'var(--transit-gate)' }} />
            <Text variant="body-lg-md" tone="primary">Bạn muốn đi đâu?</Text>
          </button>

          <div className={s.features}>
            {FEATURES.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`${s.feature} ${f.tone}`}
                onClick={f.key === 'stops' ? () => push({ name: 'stations' }) : outOfScope}
              >
                <img className={s.featureArt} src={f.img} alt="" aria-hidden width={64} height={64} />
                <Text variant="label-md-reg" tone="secondary">{f.top}</Text>
                <Text variant="label-lg-smb" tone="primary">{f.title}</Text>
              </button>
            ))}
          </div>

          <div className={s.stats}>
            <Text variant="label-md-smb" tone="on-brand" className={s.statsBadge}>VinBus lan tỏa hành trình xanh</Text>
            <div className={s.statsRow}>
              <div>
                <Text variant="body-md-reg" tone="primary" as="p">Lượng CO2 giảm</Text>
                <Text variant="title-xl-md" tone="success" as="p">49.581.400 Kg</Text>
              </div>
              <span className={s.statsRule} />
              <div>
                <Text variant="body-md-reg" tone="primary" as="p">Tương đương</Text>
                <Text variant="title-xl-md" tone="success" as="p">2.284.857 cây xanh</Text>
              </div>
            </div>
          </div>

          <Text variant="title-lg-md" tone="primary" as="h2">Tin Xanh</Text>
          <div className={s.news}>
            <span className={s.newsCard} />
            <span className={s.newsCard} />
          </div>
        </section>
      </div>
    </Screen>
  );
}
