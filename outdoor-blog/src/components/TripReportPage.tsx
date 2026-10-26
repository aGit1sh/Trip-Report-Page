"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  Clock3,
  Compass,
  Image as ImageIcon,
  Map,
  MapPin,
  Mountain,
  Route,
  Sunrise,
} from "lucide-react";
import ElevationChart from "./ElevationChart";
import { parseGPXData, TrailPoint } from "../lib/gpxParser";
import { tripPhotos } from "../lib/trip";

const TripMap = dynamic(() => import("./TripMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Preparing the map…</div>,
});

type ViewMode = "map" | "photos";

function formatElevation(value: number) {
  return `${Math.round(value).toLocaleString()} m`;
}

function formatDistance(value: number) {
  return `${value.toFixed(1)} km`;
}

function formatPhotoTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Vancouver",
  }).format(new Date(value));
}

export default function TripReportPage() {
  const [trailPoints, setTrailPoints] = useState<TrailPoint[]>([]);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [trackError, setTrackError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTrack() {
      try {
        const response = await fetch("/routes/tricouni-peak.gpx");
        if (!response.ok) {
          throw new Error(`The GPX track could not be loaded (${response.status}).`);
        }
        const points = parseGPXData(await response.text());
        if (points.length < 2) {
          throw new Error("The GPX file does not contain enough track points.");
        }
        if (!cancelled) setTrailPoints(points);
      } catch (error) {
        if (!cancelled) {
          setTrackError(
            error instanceof Error ? error.message : "The GPX track could not be loaded.",
          );
        }
      }
    }

    void loadTrack();
    return () => {
      cancelled = true;
    };
  }, []);

  const trackStats = useMemo(() => {
    if (trailPoints.length === 0) return null;
    const highestPoint = trailPoints.reduce((highest, point) =>
      point.elevation > highest.elevation ? point : highest,
    );
    const elevationGain = trailPoints.reduce((gain, point, index) => {
      if (index === 0) return gain;
      const change = point.elevation - trailPoints[index - 1].elevation;
      return gain + Math.max(0, change);
    }, 0);

    return {
      distance: trailPoints[trailPoints.length - 1].distanceKm,
      elevationGain,
      highestPoint: highestPoint.elevation,
    };
  }, [trailPoints]);

  const activePhoto = tripPhotos[activePhotoIndex];

  function movePhoto(direction: -1 | 1) {
    setActivePhotoIndex((index) => (index + direction + tripPhotos.length) % tripPhotos.length);
  }

  return (
    <main className="trip-layout">
      <article className="report-column">
        <div className="report-content">
          <Link className="back-link" href="/" aria-label="Back to all trip reports">
            <ArrowLeft size={15} strokeWidth={1.8} />
            <span>FIELD NOTES</span>
          </Link>

          <div className="report-kicker">
            <span className="kicker-dot" />
            COAST MOUNTAINS <span className="kicker-divider">/</span> BRITISH COLUMBIA
          </div>

          <h1 className="report-title">
            Tricouni
            <br />
            <span>Peak</span>
          </h1>

          <p className="report-deck">
            A full day exploring Tricouni Peak and the many wonderful lakes in the area. 
          </p>

          <div className="report-meta">
            <span>
              <Clock3 size={14} /> SEPT 12, 2026
            </span>
            <span>
              <MapPin size={14} /> SEA TO SKY
            </span>
          </div>

          <div className="stats-grid" aria-label="Trip statistics">
            <div className="stat">
              <Route size={16} />
              <span className="stat-label">DISTANCE</span>
              <strong>{trackStats ? formatDistance(trackStats.distance) : "20.4 km"}</strong>
            </div>
            <div className="stat">
              <ArrowUpRight size={16} />
              <span className="stat-label">ELEVATION GAIN</span>
              <strong>{trackStats ? formatElevation(trackStats.elevationGain) : "1,910 m"}</strong>
            </div>
            <div className="stat">
              <Mountain size={16} />
              <span className="stat-label">SUMMIT</span>
              <strong>{trackStats ? formatElevation(trackStats.highestPoint) : "—"}</strong>
            </div>
          </div>

          <section className="story-section">
            <div className="section-index">00 <span>CONTEXT</span></div>
            <p>
              It was the first week of uni at UBC for me!!! The energy was high, I was feeling adventurous, and I decided to LEAD a hike on the fifth day of having a VOC membership—that too, a class 3 scramble. It was undoubtedly audacious given I had NEVER done a hike in SWBC before and had never even done a hike with the VOC before, but I couldn’t care less and decided to start my VOC journey off with a bang (and boy it was a bang)!!!
            </p>
            <p>
              Given how close to the actual hike date I posted the trip on the website, I set my expectations very low, and wouldn’t have been surprised if it didn’t work out in the end. However, people trickled into the list and, incredibly, a few drivers also signed up. 
            </p>
            <p>
              By the pre-trip meeting, we had a healthy list of 9 people and room for 5 passengers with all the drivers. Only 7 people ended up joining the meeting and by the time all the logistics were set, we had a nice group of 6 going.
            </p>
            <div className="section-index">01 <span>THE APPROACH</span></div>
            <h2>Getting out there</h2>
            <p>
              We all met up at 4am on gameday and set off in two vehicles: I and Nolan went in a truck and the other four went in an SUV. Us two left behind the other four and we assumed they were ahead of us the whole way (a small assumption with BIG consequences). 
            </p>
            <p>
              After about two hours of driving up the Sea2Sky and then Squamish Valley Road, we found the turnoff for the logging road and began making our way up. The road started off spicy with a set of steep and uneven hills which we managed to get up. In a few sections, I could hear the 2WD really working hard but I didn’t really think much about it. After a while continuing onward, we passed a group of people car camping and then reached a big opening where we spotted the gnarliest bit yet: a huge washout with incredibly steep sides. The whole thing was just about wide enough to fit the truck in and the sides were about 1.5m/6ft tall. 
            </p>
            <p>
              We still believed that the others were ahead of us, and given we had a truck, we both decided to just go for it—after all, an SUV had done it so why couldn’t we? I stepped out of the truck to “oversee” and immediately the truck bottomed out hard going over the edge and then the hitch bottomed out as the truck got to the bottom of the washout. Nolan floored it to get out over the other side, but we only got 3/4 of the way up the incline before he started spinning out. We tried at least 3 more times but had no luck. 
            </p>
            <p>
              I have done many adventurous things before this, but I had never gotten (or seen) a vehicle stuck before, so I was utterly clueless. After stressing about for a minute, I managed to get a text to the other group who we found out was 20 minutes behind us. Soon, they said they had to stop at about the start of the logging road and would be walking up from there. 
            </p>
            <p>
              Eventually, we tried back up and the hitch dug straight into the ground and the back wheels started spinning again. Only this time, when we tried going forward, the tires kept spinning. We desperately tried pushing it around but it was to no avail—we were STUCK stuck…
            </p>
            <p>
              We then tried digging the hitch out with some branches and a hammer that Nolan had kept in his truck. We broke up some rocks that were jammed under the hitch and then managed to get ourselves free. But we were still at the bottom of the washout with no way out. At this point, we decided to ditch our efforts and started jogging down the road to see if we could find the rest of our group. We went further and further until we got all the way to the car campers without seeing any trace of them. We decided to ask the campers (who were eating breakfast now) if they could help us out. To our surprise, they agreed and took us back up in a heavy-duty Ford Lariat. When we got there, we attached tow cables (which Nolan had also brought in the truck) and a bunch of wraps of paracord to both trucks’ hitches and just fully sent it. 
            </p>
            <p>
              Our truck instantly started spinning out but theirs didn’t budge at all and hauled us all the way out of it! We sighed a HUGE breath of relief, thanked the campers bigtime, and drove down to pick up the rest of our group and drive them up. When we met up again, they had passed the campers and weren’t too far. We all rode up and could finally begin our hike at 9am (we initially got to the washout at 6:30am for reference). 
            </p>
          {/* </section> */}
{/* 
          <figure className="story-photo">
            <div
              className="story-photo-image"
              role="img"
              aria-label="Alpine peaks rising above a glacial valley"
              style={{ backgroundImage: `url("${tripPhotos[1].imageUrl}")` }}
            />
            <figcaption>
              <Camera size={13} />
              ABOVE THE TREELINE <span>·</span> 2,040 M
            </figcaption>
          </figure> */}
          {/* <section className="story-section"> */}
            <h2>Up to the treeline</h2>
            <p>
              The first 3km of the hike was just on the logging road up to the actual “trailhead” marked on google maps. From there, you can take two ways up the valley: the way on the left of the creek involves lots of boulderfields and the way on the right is insanely muddy. I’d recommend anyone doing this to stick to the route on the left for both the approach and descent—the mud was horrible. 
            </p>
            <p>
Eventually, we got to the first of three lakes on our route: Pendant Lake. It was a beautiful alpine lake which I would have loved to swim in at the end, but it got cloudy later in the day so we decided against it. From there, we passed by a campsite and then reached the smaller Spearpoint Lake. The trail goes past a waterfall and up a steep dirt slope before reaching the last and most beautiful lake: Reflection Lake. 
            </p>

            <div className="section-index">02 <span>THE SUMMIT</span></div>
            <h2>Boulder fields</h2>
            <p>
We traversed around the left edge of the lake before ascending up a mix of grass and scree for a while. Eventually, we entered a wide gulley which we ascended up for a while. Be sure to stay in the bottom of the gulley for the way up. There are many paths that take the far left edge of the gulley, but they don’t lead to the right exit. As we continued up, we eventually reached a fairly-obvious weakness in the cliff band to our right. It is a crumbly grass/dirt path up a steep chute. The presence of grass made it easier to climb as it made a bunch of little steps we could easily walk up on. 
            </p>
            <p>
Once reaching the top of the weakness, we began drifting the right and up over the big boulder fields. There was a big patch of snow up there which I ascended because I was getting quite tired of routefinding on the boulders. As we all were doing this, I happened to look back and saw a black animal walking over the boulders just below us. It was about the size of a very large dog (and that’s what I thought it was at first), but I quickly realized it was a bear and shouted out to the rest of the group (I should’ve made it a bit less dramatic next time). 
            </p>
            <p>
We all stood there amazed at the juvenile black bear making his way across the barren rocks far from any plants. Down by Reflection lake, we all got into a little conversation about whether we needed to bring bear spray up there and we all figured that bears wouldn’t go so high up into the alpine—we all stand corrected now! 
            </p>
            <p>
After that encounter, we all continued onwards with newfound excitement rushing through our veins. Eventually, we reached the first of two Class 3 scramble sections on the hike. There is a small slabby cliff we had to ascend by a patch of trees. This was probably the most technical scramble of the route, but it didn’t have much exposure. 
            </p>
            <p>
From there, we had to ascend yet another boulder field but we arrived at the top of the ridge shortly. Most of us put our packs down at the small flat shelf there before tackling the final summit push.
            </p>

            <h2>Scrambles and the summit push</h2>
            <p>
Once reaching the top of the weakness, we began drifting the right and up over the big boulder fields. There was a big patch of snow up there which I ascended because I was getting quite tired of routefinding on the boulders. As we all were doing this, I happened to look back and saw a black animal walking over the boulders just below us. It was about the size of a very large dog (and that’s what I thought it was at first), but I quickly realized it was a bear and shouted out to the rest of the group (I should’ve made it a bit less dramatic next time).
            </p>
            <p>
We all stood there amazed at the juvenile black bear making his way across the barren rocks far from any plants. Down by Reflection lake, we all got into a little conversation about whether we needed to bring bear spray up there and we all figured that bears wouldn’t go so high up into the alpine—we all stand corrected now!
            </p>
            <p>
After that encounter, we all continued onwards with newfound excitement rushing through our veins. Eventually, we reached the first of two Class 3 scramble sections on the hike. There is a small slabby cliff we had to ascend by a patch of trees. This was probably the most technical scramble of the route, but it didn’t have much exposure.
            </p>
            <p>
From there, we had to ascend yet another boulder field but we arrived at the top of the ridge shortly. Most of us put our packs down at the small flat shelf there before tackling the final summit push.
            </p>
            <p>
Just below the summit is one last tricky scramble. There’s either a dusty, worn-down route up on the right of the ridge or a slabby way up the very crest of the ridge. While the crest of the ridge isn’t as steep, you have to be very careful with your handholds. The summit itself kind of just came right out of nowhere. After finishing that move, I looked up expecting to see a bunch of scrambling left but was left standing only 2m below the summit. We all had a big cheer at the top and I did a fun traverse over to the second (east) peak which I found to be slightly shorter than the first (west) peak. We all took 10 minutes calling our parents with the 3 bars we had up there and then headed down to have lunch at the plateau where we left our bags.       
            </p>
          </section>

          <aside className="field-note">
            <Sunrise size={18} />
            <div>
              <span>FIELD NOTE</span>
              <p>Start early. The loop is long, and the alpine weather can turn quickly.</p>
            </div>
          </aside>
        </div>
      </article>

      <aside className="visual-column" aria-label="Interactive route and trip photos">
        <div className="visual-topbar">
          <div className="visual-heading">
            <Compass size={16} />
            <div>
              <span className="visual-eyebrow">ROUTE DATA</span>
            </div>
          </div>

          <div className="view-switch" role="tablist" aria-label="Choose map or photos">
            <button
              className={viewMode === "map" ? "view-tab active" : "view-tab"}
              type="button"
              role="tab"
              aria-selected={viewMode === "map"}
              onClick={() => setViewMode("map")}
            >
              <Map size={15} /> MAP
            </button>
            <button
              className={viewMode === "photos" ? "view-tab active" : "view-tab"}
              type="button"
              role="tab"
              aria-selected={viewMode === "photos"}
              onClick={() => setViewMode("photos")}
            >
              <ImageIcon size={15} /> PHOTOS <span>{tripPhotos.length}</span>
            </button>
          </div>
        </div>

        {viewMode === "map" ? (
          <div className="map-view">
            <div className="map-frame">
              {trackError ? (
                <div className="map-error" role="alert">
                  <MapPin size={20} />
                  <span>{trackError}</span>
                  <button type="button" onClick={() => window.location.reload()}>
                    TRY AGAIN
                  </button>
                </div>
              ) : (
                <>
                  <TripMap
                    trailPoints={trailPoints}
                    activePointIndex={activePointIndex}
                    photos={tripPhotos}
                    activePhotoId={activePhoto.id}
                    onSelectPhoto={(id) => {
                      const photoIndex = tripPhotos.findIndex((photo) => photo.id === id);
                      if (photoIndex >= 0) setActivePhotoIndex(photoIndex);
                    }}
                  />
                  <div className="map-legend">
                    <span><i className="legend-route" /> GPX TRACK</span>
                    <span><i className="legend-photo"><Camera size={10} /></i> PHOTO</span>
                  </div>
                  <div className="map-attribution">© OpenTopoMap · OpenStreetMap contributors</div>
                </>
              )}
            </div>

            <div className="elevation-wrap">
              <div className="elevation-heading">
                <div>
                  <span className="visual-eyebrow">TERRAIN PROFILE</span>
                  <strong>Elevation</strong>
                </div>
                <span className="elevation-high">
                  <Mountain size={13} />
                  {trackStats ? formatElevation(trackStats.highestPoint) : "2,123 m"}
                </span>
              </div>
              <ElevationChart
                trailPoints={trailPoints}
                onHoverPoint={setActivePointIndex}
              />
              <div className="chart-endpoints">
                <span>TRAILHEAD</span>
                <span>{trackStats ? formatDistance(trackStats.distance) : "20.4 km"}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="gallery-view">
            <div
              className="gallery-image"
              role="img"
              aria-label={activePhoto.caption}
              style={{ backgroundImage: `url("${activePhoto.imageUrl}")` }}
            >
              <div className="gallery-image-shade" />
              <div className="photo-counter">
                <Camera size={14} />
                <span>{String(activePhotoIndex + 1).padStart(2, "0")}</span>
                <i />
                <span>{String(tripPhotos.length).padStart(2, "0")}</span>
              </div>
              <div className="gallery-controls">
                <button type="button" aria-label="Previous photo" onClick={() => movePhoto(-1)}>
                  <ArrowLeft size={18} />
                </button>
                <button type="button" aria-label="Next photo" onClick={() => movePhoto(1)}>
                  <ArrowRight size={18} />
                </button>
              </div>
              <div className="gallery-caption">
                {activePhoto.distanceKm !== null && (
                  <span className="photo-location">
                    <MapPin size={13} /> {activePhoto.distanceKm.toFixed(1)} KM ON ROUTE
                  </span>
                )}
                <h2>{activePhoto.caption}</h2>
              </div>
            </div>
            <div className="gallery-details">
              {activePhoto.lat !== null && activePhoto.lng !== null && (
                <div className="photo-coordinate">
                  <MapPin size={15} />
                  <span>
                    {Math.abs(activePhoto.lat).toFixed(4)}° {activePhoto.lat >= 0 ? "N" : "S"},{" "}
                    {Math.abs(activePhoto.lng).toFixed(4)}° {activePhoto.lng >= 0 ? "E" : "W"}
                  </span>
                </div>
              )}
              {activePhoto.elevation !== null && (
                <div className="photo-elevation">
                  <Mountain size={15} />
                  <span>{formatElevation(activePhoto.elevation)}</span>
                </div>
              )}
              {activePhoto.capturedAt && (
                <div className="photo-time">
                  <Clock3 size={15} />
                  <span>{formatPhotoTime(activePhoto.capturedAt)}</span>
                </div>
              )}
              {activePhoto.locationSource && (
                <span className="metadata-label">
                  <Check size={13} />
                  {activePhoto.locationSource === "image-gps" ? "EXIF GPS" : "MATCHED TO GPX"}
                </span>
              )}
              {!activePhoto.locationSource && (
                <span className="metadata-label">
                  <MapPin size={13} /> NO GPS DATA
                </span>
              )}
            </div>
            <div className="thumbnail-rail" aria-label="Choose a photo">
              {tripPhotos.map((photo, index) => (
                <button
                  className={index === activePhotoIndex ? "thumbnail active" : "thumbnail"}
                  key={photo.id}
                  type="button"
                  aria-label={`Show photo: ${photo.caption}`}
                  aria-current={index === activePhotoIndex}
                  onClick={() => setActivePhotoIndex(index)}
                  style={{ backgroundImage: `url("${photo.imageUrl}")` }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
              <div className="thumbnail-note">
                <span>TRICOUNI PEAK</span>
                <span>LOCATION WHEN AVAILABLE</span>
              </div>
            </div>
            <p className="gallery-hint"><Camera size={13} /> Select a frame to explore the day</p>
          </div>
        )}
      </aside>
    </main>
  );
}
