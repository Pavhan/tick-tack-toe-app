use server_rust::{config, db, http};

#[tokio::main]
async fn main() {
    if let Err(error) = start().await {
        eprintln!("Failed to start server: {error}");
        std::process::exit(1);
    }
}

async fn start() -> Result<(), Box<dyn std::error::Error>> {
    let cfg = config::config();

    db::init()?;

    let router = http::routes::build_router();
    let listener = tokio::net::TcpListener::bind(cfg.address()).await?;

    println!(
        "Server running at http://localhost:{}",
        cfg.port()
    );

    axum::serve(listener, router.into_make_service())
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = tokio::signal::ctrl_c();

    #[cfg(unix)]
    let terminate = async {
        use tokio::signal::unix::{SignalKind, signal};
        let mut sigterm = signal(SignalKind::terminate()).expect("Cannot catch SIGTERM");
        sigterm.recv().await
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    println!("Stopping server...");
}
