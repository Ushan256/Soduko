import tensorflow as tf
from tensorflow.keras import layers, models
import os

def train_and_save():
    print("--- Starting AI Model Training ---")
    
    # 1. Load MNIST Dataset (70,000 images of handwritten digits)
    mnist = tf.keras.datasets.mnist
    (x_train, y_train), (x_test, y_test) = mnist.load_data()
    
    # Normalize pixel values to be between 0 and 1
    x_train, x_test = x_train / 255.0, x_test / 255.0

    # 2. Build the Convolutional Neural Network (CNN)
    # This architecture is optimized for digit recognition
    model = models.Sequential([
        layers.Input(shape=(28, 28, 1)),
        layers.Conv2D(32, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dense(10, activation='softmax') # 10 outputs for digits 0-9
    ])

    model.compile(optimizer='adam', 
                  loss='sparse_categorical_crossentropy', 
                  metrics=['accuracy'])

    # 3. Train the model
    print("Training for 3 epochs (this may take a minute)...")
    model.fit(x_train, y_train, epochs=3)
    
    # 4. Save the "Brain" file
    model_name = 'sudoku_digit_model.h5'
    model.save(model_name)
    print(f"\nSUCCESS! Model saved as: {model_name}")
    print(f"Location: {os.getcwd()}")

if __name__ == "__main__":
    train_and_save()