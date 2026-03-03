import BodyClassProvider from '@/components/BodyClassProvider'

export default function NotFound() {
  return (
    <>
      <BodyClassProvider page="404" />
      
      <div className="not-found-page h-pad">
        <div className="inner-wrap">
          <h1 className="bigger">404</h1>

          <p>Page not found.<br />The page you're looking for doesn't exist.</p>
        </div>
      </div>
    </>
  )
}

